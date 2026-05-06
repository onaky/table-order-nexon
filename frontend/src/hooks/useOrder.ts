import { useQuery, useMutation } from '@tanstack/react-query';
import { orderApi } from '@/api/order.api';
import { CreateOrderRequest, UpdateOrderStatusRequest } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
  });
}

export function useOrders() {
  const tableInfo = useAuthStore((s) => s.tableInfo);

  return useQuery({
    queryKey: ['orders', tableInfo?.id, tableInfo?.sessionId],
    queryFn: async () => {
      if (!tableInfo?.id || !tableInfo?.sessionId) return [];
      const res = await orderApi.getOrders(tableInfo.id, tableInfo.sessionId);
      return res.data ?? [];
    },
    enabled: !!tableInfo?.id && !!tableInfo?.sessionId,
  });
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderStatusRequest }) =>
      orderApi.updateOrderStatus(id, data),
  });
}

export function useDeleteOrder() {
  return useMutation({
    mutationFn: (id: number) => orderApi.deleteOrder(id),
  });
}

export function useOrderHistory(tableId: number, date?: string) {
  return useQuery({
    queryKey: ['order-history', tableId, date],
    queryFn: async () => {
      const res = await orderApi.getOrderHistory(tableId, date);
      return res.data ?? [];
    },
    enabled: !!tableId,
  });
}
