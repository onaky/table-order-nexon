import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/order.api';
import { CreateOrderRequest, UpdateOrderStatusRequest } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: () => {
      // 주문 생성 후 주문 내역 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrders() {
  const tableInfo = useAuthStore((s) => s.tableInfo);

  // 목업 모드: tableInfo 없으면 기본값 사용
  const effectiveTableId = tableInfo?.id ?? 1;
  const effectiveSessionId = tableInfo?.sessionId ?? 'session-001';

  return useQuery({
    queryKey: ['orders', effectiveTableId, effectiveSessionId],
    queryFn: async () => {
      const res = await orderApi.getOrders(effectiveTableId, effectiveSessionId);
      return res.data ?? [];
    },
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
