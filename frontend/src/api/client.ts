import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  // zustand persist storage에서 토큰 읽기
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // 파싱 실패 시 무시
    }
  }
  return config;
});

// Response interceptor: 401 시 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-info');
      // 현재 경로에 따라 적절한 로그인 페이지로 리다이렉트
      const isAdmin = window.location.pathname.startsWith('/admin');
      window.location.href = isAdmin ? '/admin/login' : '/customer/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
