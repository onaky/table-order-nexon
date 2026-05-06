import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import { TableLoginRequest, AdminLoginRequest } from '@/types';

export function useTableLogin() {
  const navigate = useNavigate();
  const setTableAuth = useAuthStore((s) => s.setTableAuth);

  return useMutation({
    mutationFn: (data: TableLoginRequest) => authApi.tableLogin(data),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setTableAuth(res.data.token, res.data.table);
        navigate('/customer/menu');
      }
    },
  });
}

export function useAdminLogin() {
  const navigate = useNavigate();
  const setAdminAuth = useAuthStore((s) => s.setAdminAuth);

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => authApi.adminLogin(data),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setAdminAuth(res.data.token, res.data.admin);
        navigate('/admin/dashboard');
      }
    },
  });
}
