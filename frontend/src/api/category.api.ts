import apiClient from './client';
import { ApiResponse, Category } from '@/types';
import { mockCategories } from '@/mocks/categories';

const USE_MOCK = false;

export const categoryApi = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { success: true, data: mockCategories };
    }
    const res = await apiClient.get('/categories');
    return res.data;
  },

  createCategory: async (data: { name: string }): Promise<ApiResponse<Category>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const newCat: Category = { id: Date.now(), storeId: 'store-01', name: data.name, sortOrder: 999 };
      return { success: true, data: newCat };
    }
    const res = await apiClient.post('/categories', data);
    return res.data;
  },

  updateCategory: async (id: number, data: { name: string }): Promise<ApiResponse<Category>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const cat = mockCategories.find((c) => c.id === id);
      if (!cat) return { success: false, error: '카테고리를 찾을 수 없습니다.' };
      return { success: true, data: { ...cat, ...data } };
    }
    const res = await apiClient.put(`/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    }
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  },
};
