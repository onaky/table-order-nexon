import { useEffect, useRef } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { Order, OrderStatus } from '@/types';

export function useSSE(storeId: string | null) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const { addOrder, updateOrderStatus, deleteOrder, completeTable, setConnected, initMockData, useMock, tables } =
    useOrderStore();

  useEffect(() => {
    // 목업 모드: storeId 없어도 목업 데이터 초기화
    if (useMock) {
      // 이미 초기화되었으면 스킵
      if (tables.length === 0) {
        initMockData();
      }
      return;
    }

    // 실제 모드에서는 storeId 필수
    if (!storeId) return;

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
  }, [storeId, useMock, tables.length, addOrder, updateOrderStatus, deleteOrder, completeTable, setConnected, initMockData]);
}
