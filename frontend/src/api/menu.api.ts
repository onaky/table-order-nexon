import apiClient from './client';
import { ApiResponse, Menu, MenuDetail, CreateMenuRequest, UpdateMenuRequest, ReorderMenusRequest } from '@/types';
import { mockMenus } from '@/mocks/menus';

const USE_MOCK = false;

export const menuApi = {
  getMenus: async (categoryId?: number): Promise<ApiResponse<Menu[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const filtered = categoryId
        ? mockMenus.filter((m) => m.categoryId === categoryId)
        : mockMenus;
      return { success: true, data: filtered };
    }
    const res = await apiClient.get('/menus', { params: { categoryId } });
    return res.data;
  },

  getMenuById: async (id: number): Promise<ApiResponse<MenuDetail>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const menu = mockMenus.find((m) => m.id === id);
      if (!menu) return { success: false, error: '메뉴를 찾을 수 없습니다.' };
      return { success: true, data: menu };
    }
    const res = await apiClient.get(`/menus/${id}`);
    // BE 응답 변환: menuIngredients[].ingredient → ingredients[]
    const menuData = res.data.data;
    if (menuData && menuData.menuIngredients) {
      menuData.ingredients = menuData.menuIngredients.map((mi: any) => ({
        id: mi.ingredient?.id ?? mi.ingredientId,
        name: mi.ingredient?.name ?? '',
        imageUrl: mi.ingredient?.imageUrl ?? '',
        calories: mi.ingredient?.calories ?? 0,
        flavorProfile: mi.ingredient?.flavor ? [mi.ingredient.flavor] : [],
        isVegan: mi.ingredient?.isVegan ?? false,
      }));
      delete menuData.menuIngredients;
    } else {
      menuData.ingredients = [];
    }
    return res.data;
  },

  createMenu: async (data: CreateMenuRequest): Promise<ApiResponse<Menu>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const newMenu: Menu = { id: Date.now(), sortOrder: 999, imageUrl: '', ...data };
      return { success: true, data: newMenu };
    }
    const res = await apiClient.post('/menus', data);
    return res.data;
  },

  updateMenu: async (id: number, data: UpdateMenuRequest): Promise<ApiResponse<Menu>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const menu = mockMenus.find((m) => m.id === id);
      if (!menu) return { success: false, error: '메뉴를 찾을 수 없습니다.' };
      return { success: true, data: { ...menu, ...data } };
    }
    const res = await apiClient.put(`/menus/${id}`, data);
    return res.data;
  },

  deleteMenu: async (id: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    }
    const res = await apiClient.delete(`/menus/${id}`);
    return res.data;
  },

  reorderMenus: async (data: ReorderMenusRequest): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      // 목업에서도 실제 순서 변경 반영
      data.menuIds.forEach((id, idx) => {
        const menu = mockMenus.find((m) => m.id === id);
        if (menu) menu.sortOrder = idx + 1;
      });
      // mockMenus 배열 순서도 변경
      mockMenus.sort((a, b) => a.sortOrder - b.sortOrder);
      return { success: true };
    }
    const res = await apiClient.put('/menus/reorder', data);
    return res.data;
  },
};
