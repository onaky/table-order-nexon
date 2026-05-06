import { useOrders } from '@/hooks/useOrder';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function OrderHistoryPage() {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <Layout>
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold text-white mb-4">주문 내역</h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">아직 주문 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="card" data-testid={`order-history-${order.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-400">#{order.orderNumber}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        {item.menuName} × {item.quantity}
                      </span>
                      <span className="text-gray-400">
                        ₩{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-surface-border flex items-center justify-between">
                  <span className="text-xs text-gray-500">합계</span>
                  <span className="text-sm font-bold text-white">
                    ₩{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
