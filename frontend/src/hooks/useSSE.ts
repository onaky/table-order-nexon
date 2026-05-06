import { useEffect, useRef } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { Order, OrderStatus } from '@/types';

export function useSSE(storeId: string | null) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const { addOrder, updateOrderStatus, deleteOrder, completeTable, setConnected, initMockData, useMock } =
    useOrderStore();

  useEffect(() => {
    if (!storeId) return;

    // 목업 모드: 실제 SSE 대신 목업 데이터 초기화
    if (useMock) {
      initMockData();
      return;
    }

    // 실제 SSE 연결
    const eventSource = new EventSource(`/api/sse/orders?storeId=${storeId}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.addEventListener('new-order', (e) => {
      const { order } = JSON.parse(e.data) as { order: Order };
      addOrder(order);
    });

    eventSource.addEventListener('status-change', (e) => {
      const { orderId, status } = JSON.parse(e.data) as { orderId: number; status: OrderStatus };
      updateOrderStatus(orderId, status);
    });

    eventSource.addEventListener('order-deleted', (e) => {
      const { orderId, tableId } = JSON.parse(e.data) as { orderId: number; tableId: number };
      deleteOrder(orderId, tableId);
    });

    eventSource.addEventListener('table-completed', (e) => {
      const { tableId } = JSON.parse(e.data) as { tableId: number };
      completeTable(tableId);
    });

    eventSource.onerror = () => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [storeId, useMock, addOrder, updateOrderStatus, deleteOrder, completeTable, setConnected, initMockData]);
}
