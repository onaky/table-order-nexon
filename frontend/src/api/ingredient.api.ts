import apiClient from './client';
import { ApiResponse, Ingredient, CreateIngredientRequest } from '@/types';
import { mockIngredients } from '@/mocks/ingredients';

const USE_MOCK = true;

export const ingredientApi = {
  getIngredients: async (): Promise<ApiResponse<Ingredient[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true, data: mockIngredients };
    }
    const res = await apiClient.get('/ingredients');
    return res.data;
  },

  getMenuIngredients: async (menuId: number): Promise<ApiResponse<Ingredient[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      // 목업에서는 menus에서 직접 가져옴
      const { mockMenus } = await import('@/mocks/menus');
      const menu = mockMenus.find((m) => m.id === menuId);
      return { success: true, data: menu?.ingredients ?? [] };
    }
    const res = await apiClient.get(`/menus/${menuId}/ingredients`);
    return res.data;
  },

  createIngredient: async (data: CreateIngredientRequest): Promise<ApiResponse<Ingredient>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const newIngredient: Ingredient = { id: Date.now(), imageUrl: '', ...data };
      return { success: true, data: newIngredient };
    }
    const res = await apiClient.post('/ingredients', data);
    return res.data;
  },

  updateIngredient: async (id: number, data: Partial<CreateIngredientRequest>): Promise<ApiResponse<Ingredient>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const ingredient = mockIngredients.find((i) => i.id === id);
      if (!ingredient) return { success: false, error: '재료를 찾을 수 없습니다.' };
      return { success: true, data: { ...ingredient, ...data } };
    }
    const res = await apiClient.put(`/ingredients/${id}`, data);
    return res.data;
  },

  deleteIngredient: async (id: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    }
    const res = await apiClient.delete(`/ingredients/${id}`);
    return res.data;
  },

  linkToMenu: async (menuId: number, ingredientId: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true };
    }
    const res = await apiClient.post(`/menus/${menuId}/ingredients/${ingredientId}`);
    return res.data;
  },

  unlinkFromMenu: async (menuId: number, ingredientId: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true };
    }
    const res = await apiClient.delete(`/menus/${menuId}/ingredients/${ingredientId}`);
    return res.data;
  },
};
