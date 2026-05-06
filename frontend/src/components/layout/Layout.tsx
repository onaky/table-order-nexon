import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CartBadge from '@/components/common/CartBadge';
import ToastContainer from '@/components/common/Toast';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCustomer = location.pathname.startsWith('/customer');
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname.includes('/login');

  return (
    <div className="min-h-screen bg-surface">
      <ToastContainer />

      {/* Customer Header */}
      {isCustomer && !isLoginPage && (
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-surface-border">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate('/customer/menu')}
              className="text-lg font-bold text-white"
              data-testid="customer-logo"
            >
              TABLE ORDER
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/customer/orders')}
                className="p-2 rounded-xl hover:bg-surface-lighter transition-colors text-gray-300"
                data-testid="order-history-btn"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
              <CartBadge />
            </div>
          </div>
        </header>
      )}

      {/* Admin Header */}
      {isAdmin && !isLoginPage && (
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">TABLE ORDER ADMIN</h1>
            <nav className="flex items-center gap-1">
              {[
                { path: '/admin/dashboard', label: '대시보드' },
                { path: '/admin/tables', label: '테이블' },
                { path: '/admin/menus', label: '메뉴' },
                { path: '/admin/ingredients', label: '재료' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-gray-400 hover:text-white hover:bg-surface-lighter'
                  }`}
                  data-testid={`admin-nav-${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </header>
      )}

      {/* Content */}
      <main className={isCustomer && !isLoginPage ? 'max-w-lg mx-auto' : ''}>
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
