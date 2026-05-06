import apiClient from './client';
import { ApiResponse, TableLoginRequest, AdminLoginRequest, TableInfo, Admin } from '@/types';

const USE_MOCK = false;

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
    // BE 응답: { token, table: { id, storeId, tableNo }, session: { sessionId, startedAt } }
    const { token, table, session } = res.data.data;
    return {
      success: true,
      data: {
        token,
        table: { ...table, sessionId: session?.sessionId ?? null },
      },
    };
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
