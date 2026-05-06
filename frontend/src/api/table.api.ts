import apiClient from './client';
import { ApiResponse, TableDashboard, SetupTableRequest } from '@/types';
import { mockTableDashboards } from '@/mocks/orders';

const USE_MOCK = true;

export const tableApi = {
  getTables: async (): Promise<ApiResponse<TableDashboard[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true, data: mockTableDashboards };
    }
    const res = await apiClient.get('/tables');
    return res.data;
  },

  setupTable: async (data: SetupTableRequest): Promise<ApiResponse<{ tableId: number }>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, data: { tableId: data.tableNo } };
    }
    const res = await apiClient.post('/tables/setup', data);
    return res.data;
  },

  completeTable: async (tableId: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    }
    const res = await apiClient.post(`/tables/${tableId}/complete`);
    return res.data;
  },
};
