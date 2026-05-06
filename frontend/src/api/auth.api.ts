import apiClient from './client';
import { ApiResponse, TableLoginRequest, AdminLoginRequest, AuthToken, TableInfo, Admin } from '@/types';

const USE_MOCK = true;

export const authApi = {
  tableLogin: async (data: TableLoginRequest): Promise<ApiResponse<{ token: string; table: TableInfo }>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return {
        success: true,
        data: {
          token: 'mock-table-token-' + Date.now(),
          table: { id: 1, storeId: data.storeId, tableNo: data.tableNo, sessionId: null },
        },
      };
    }
    const res = await apiClient.post('/auth/table/login', data);
    return res.data;
  },

  adminLogin: async (data: AdminLoginRequest): Promise<ApiResponse<{ token: string; admin: Admin }>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return {
        success: true,
        data: {
          token: 'mock-admin-token-' + Date.now(),
          admin: { id: 1, storeId: data.storeId, username: data.username },
        },
      };
    }
    const res = await apiClient.post('/auth/admin/login', data);
    return res.data;
  },

  verifyToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
    if (USE_MOCK) {
      return { success: true, data: { valid: true } };
    }
    const res = await apiClient.post('/auth/verify');
    return res.data;
  },
};
