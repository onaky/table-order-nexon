import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import Layout from '@/components/layout/Layout';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();

  return (
    <Layout>
      <div className="px-4 py-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">장바구니</h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
              data-testid="cart-clear"
            >
              전체 삭제
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
            <button
              onClick={() => navigate('/customer/menu')}
              className="btn-secondary"
            >
              메뉴 보러가기
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.menuId}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  className="card flex gap-3"
                  data-testid={`cart-item-${item.menuId}`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-lighter flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                    <p className="text-primary-400 text-sm font-bold mt-1">
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-surface-lighter border border-surface-border flex items-center justify-center text-gray-400 hover:text-white"
                      data-testid={`cart-item-minus-${item.menuId}`}
                    >
                      −
                    </button>
                    <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-surface-lighter border border-surface-border flex items-center justify-center text-gray-400 hover:text-white"
                      data-testid={`cart-item-plus-${item.menuId}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.menuId)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400"
                      data-testid={`cart-item-remove-${item.menuId}`}
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* 하단 고정 주문 버튼 */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-surface-border p-4">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">총 금액</span>
              <span className="text-xl font-bold text-white">₩{totalAmount.toLocaleString()}</span>
            </div>
            <button
              onClick={() => navigate('/customer/order/confirm')}
              className="btn-primary w-full"
              data-testid="cart-order-btn"
            >
              주문하기
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
