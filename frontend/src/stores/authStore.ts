import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, TableInfo } from '@/types';

interface AuthState {
  token: string | null;
  tableInfo: TableInfo | null;
  adminInfo: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  setTableAuth: (token: string, tableInfo: TableInfo) => void;
  setAdminAuth: (token: string, adminInfo: Admin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tableInfo: null,
      adminInfo: null,
      isAuthenticated: false,
      isAdmin: false,

      setTableAuth: (token, tableInfo) =>
        set({
          token,
          tableInfo,
          adminInfo: null,
          isAuthenticated: true,
          isAdmin: false,
        }),

      setAdminAuth: (token, adminInfo) =>
        set({
          token,
          tableInfo: null,
          adminInfo,
          isAuthenticated: true,
          isAdmin: true,
        }),

      logout: () =>
        set({
          token: null,
          tableInfo: null,
          adminInfo: null,
          isAuthenticated: false,
          isAdmin: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        tableInfo: state.tableInfo,
        adminInfo: state.adminInfo,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    },
  ),
);
