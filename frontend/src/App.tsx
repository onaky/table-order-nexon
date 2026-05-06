import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

// Customer Pages
const CustomerLoginPage = lazy(() => import('./pages/customer/CustomerLoginPage'));
const MenuPage = lazy(() => import('./pages/customer/MenuPage'));
const MenuDetailPage = lazy(() => import('./pages/customer/MenuDetailPage'));
const CartPage = lazy(() => import('./pages/customer/CartPage'));
const OrderConfirmPage = lazy(() => import('./pages/customer/OrderConfirmPage'));
const OrderSuccessPage = lazy(() => import('./pages/customer/OrderSuccessPage'));
const OrderHistoryPage = lazy(() => import('./pages/customer/OrderHistoryPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const TableManagementPage = lazy(() => import('./pages/admin/TableManagementPage'));
const MenuManagementPage = lazy(() => import('./pages/admin/MenuManagementPage'));
const IngredientManagementPage = lazy(() => import('./pages/admin/IngredientManagementPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/customer/menu" replace />} />

        {/* Customer Routes */}
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer/menu" element={<MenuPage />} />
        <Route path="/customer/menu/:id" element={<MenuDetailPage />} />
        <Route path="/customer/cart" element={<CartPage />} />
        <Route path="/customer/order/confirm" element={<OrderConfirmPage />} />
        <Route path="/customer/order/success" element={<OrderSuccessPage />} />
        <Route path="/customer/orders" element={<OrderHistoryPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/tables" element={<TableManagementPage />} />
        <Route path="/admin/menus" element={<MenuManagementPage />} />
        <Route path="/admin/ingredients" element={<IngredientManagementPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/customer/menu" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
