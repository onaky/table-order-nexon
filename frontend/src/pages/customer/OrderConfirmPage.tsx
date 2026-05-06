import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useCreateOrder } from '@/hooks/useOrder';
import { showToast } from '@/components/common/Toast';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/common/Toast';

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  const tableInfo = useAuthStore((s) => s.tableInfo);
  const createOrder = useCreateOrder();
  // 주문 확정 후 clearCart로 items가 비어도 리다이렉트 방지
  const hasSubmitted = useRef(false);

  const handleConfirmOrder = () => {
    hasSubmitted.current = true;

    // 목업 모드: tableInfo 없으면 기본값 사용
    const effectiveTableInfo = tableInfo || { id: 1, storeId: 'store-01', tableNo: 1, sessionId: 'session-001' };

    createOrder.mutate(
      {
        tableId: effectiveTableInfo.id,
        sessionId: effectiveTableInfo.sessionId || 'session-001',
        items: items.map((item) => ({ menuId: item.menuId, quantity: item.quantity })),
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            clearCart();
            navigate('/customer/order/success', {
              state: { orderNumber: res.data.orderNumber },
              replace: true,
            });
          } else {
            hasSubmitted.current = false;
            showToast('error', res.error || '주문에 실패했습니다.');
          }
        },
        onError: () => {
          hasSubmitted.current = false;
          showToast('error', '주문 처리 중 오류가 발생했습니다.');
        },
      },
    );
  };

  // 장바구니 비어있고 아직 주문 제출 안 했으면 cart로 이동
  if (items.length === 0 && !hasSubmitted.current) {
    navigate('/customer/cart', { replace: true });
    return null;
  }

  return (
    <Layout>
      <ToastContainer />
      <div className="px-4 py-4 pb-32">
        <h2 className="text-xl font-bold text-white mb-4">주문 확인</h2>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.menuId} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-lighter">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">수량: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-primary-400">
                ₩{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 card">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">총 주문 금액</span>
            <span className="text-2xl font-bold text-white">₩{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-surface-border p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={() => navigate('/customer/cart')}
            className="btn-secondary flex-1"
          >
            뒤로
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={createOrder.isPending}
            className="btn-primary flex-[2] disabled:opacity-50"
            data-testid="order-confirm-btn"
          >
            {createOrder.isPending ? '주문 중...' : '주문 확정'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
