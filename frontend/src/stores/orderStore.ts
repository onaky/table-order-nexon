import { create } from 'zustand';
import { Order, OrderStatus, TableDashboard } from '@/types';
import { mockTableDashboards } from '@/mocks/orders';

interface OrderState {
  tables: TableDashboard[];
  connected: boolean;
  useMock: boolean;

  setTables: (tables: TableDashboard[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  deleteOrder: (orderId: number, tableId: number) => void;
  completeTable: (tableId: number) => void;
  setConnected: (connected: boolean) => void;
  initMockData: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  tables: [],
  connected: false,
  useMock: true,

  setTables: (tables) => set({ tables }),

  addOrder: (order) =>
    set((state) => {
      const tables = state.tables.map((table) => {
        if (table.id === order.tableId) {
          return {
            ...table,
            orders: [...table.orders, order],
            totalAmount: table.totalAmount + order.totalAmount,
            hasActiveSession: true,
            sessionId: order.sessionId,
          };
        }
        return table;
      });
      return { tables };
    }),

  updateOrderStatus: (orderId, status) =>
    set((state) => {
      const tables = state.tables.map((table) => ({
        ...table,
        orders: table.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      }));
      return { tables };
    }),

  deleteOrder: (orderId, tableId) =>
    set((state) => {
      const tables = state.tables.map((table) => {
        if (table.id === tableId) {
          const deletedOrder = table.orders.find((o) => o.id === orderId);
          const newOrders = table.orders.filter((o) => o.id !== orderId);
          return {
            ...table,
            orders: newOrders,
            totalAmount: table.totalAmount - (deletedOrder?.totalAmount ?? 0),
          };
        }
        return table;
      });
      return { tables };
    }),

  completeTable: (tableId) =>
    set((state) => {
      const tables = state.tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            orders: [],
            totalAmount: 0,
            hasActiveSession: false,
            sessionId: null,
          };
        }
        return table;
      });
      return { tables };
    }),

  setConnected: (connected) => set({ connected }),

  initMockData: () => set({ tables: mockTableDashboards, connected: true }),
}));
