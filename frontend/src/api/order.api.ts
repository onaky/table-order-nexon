import apiClient from './client';
import { ApiResponse, Order, CreateOrderRequest, UpdateOrderStatusRequest, OrderHistory } from '@/types';
import { mockOrders } from '@/mocks/orders';

const USE_MOCK = true;
let mockOrderCounter = 5;

export const orderApi = {
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));
      mockOrderCounter++;
      const now = new Date();
      const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const newOrder: Order = {
        id: Date.now(),
        orderNumber: `${dateStr}-${String(mockOrderCounter).padStart(3, '0')}`,
        tableId: data.tableId,
        tableNo: data.tableId,
        sessionId: data.sessionId,
        status: 'pending',
        totalAmount: 0,
        items: data.items.map((item, idx) => ({
          id: Date.now() + idx,
          menuId: item.menuId,
          menuName: `메뉴 ${item.menuId}`,
          quantity: item.quantity,
          unitPrice: 0,
        })),
        createdAt: now.toISOString(),
      };
      return { success: true, data: newOrder };
    }
    const res = await apiClient.post('/orders', data);
    return res.data;
  },

  getOrders: async (tableId: number, sessionId: string): Promise<ApiResponse<Order[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const filtered = mockOrders.filter(
        (o) => o.tableId === tableId && o.sessionId === sessionId,
      );
      return { success: true, data: filtered };
    }
    const res = await apiClient.get('/orders', { params: { tableId, sessionId } });
    return res.data;
  },

  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const order = mockOrders.find((o) => o.id === id);
      if (!order) return { success: false, error: '주문을 찾을 수 없습니다.' };
      return { success: true, data: { ...order, status: data.status } };
    }
    const res = await apiClient.put(`/orders/${id}/status`, data);
    return res.data;
  },

  deleteOrder: async (id: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    }
    const res = await apiClient.delete(`/orders/${id}`);
    return res.data;
  },

  getOrderHistory: async (tableId: number, date?: string): Promise<ApiResponse<OrderHistory[]>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const history: OrderHistory[] = [
        {
          id: 100,
          orderNumber: '0505-001',
          tableNo: tableId,
          totalAmount: 45000,
          items: [
            { id: 101, menuId: 1, menuName: '트러플 시그니처 버거', quantity: 2, unitPrice: 18000 },
            { id: 102, menuId: 8, menuName: '레몬 에이드', quantity: 1, unitPrice: 5000 },
          ],
          createdAt: '2026-05-05T12:30:00Z',
          completedAt: '2026-05-05T14:00:00Z',
        },
      ];
      return { success: true, data: history };
    }
    const res = await apiClient.get(`/tables/${tableId}/history`, { params: { date } });
    return res.data;
  },
};
