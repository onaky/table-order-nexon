import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { useSSE } from '@/hooks/useSSE';
import { useOrderHistory } from '@/hooks/useOrder';
import { OrderStatus, TableDashboard } from '@/types';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import OrderTimeIndicator from '@/components/order/OrderTimeIndicator';
import ConfirmModal from '@/components/common/ConfirmModal';
import { showToast } from '@/components/common/Toast';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/common/Toast';

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing',
  preparing: 'completed',
  completed: null,
};

export default function TableManagementPage() {
  const adminInfo = useAuthStore((s) => s.adminInfo);
  const { tables, completeTable, updateOrderStatus, deleteOrder } = useOrderStore();
  const [selectedTable, setSelectedTable] = useState<TableDashboard | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTableId, setHistoryTableId] = useState<number>(0);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: number; tableId?: number } | null>(null);

  useSSE(adminInfo?.storeId ?? null);

  const { data: history = [] } = useOrderHistory(historyTableId);

  const handleComplete = (tableId: number) => {
    setConfirmAction({ type: 'complete-table', id: tableId });
  };

  const handleDeleteOrder = (orderId: number, tableId: number) => {
    setConfirmAction({ type: 'delete-order', id: orderId, tableId });
  };

  const handleStatusChange = (orderId: number, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    showToast('success', '주문 상태가 변경되었습니다.');
  };

  const executeConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'complete-table') {
      completeTable(confirmAction.id);
      setSelectedTable(null);
      showToast('success', '테이블 이용 완료 처리되었습니다.');
    } else if (confirmAction.type === 'delete-order') {
      deleteOrder(confirmAction.id, confirmAction.tableId!);
      showToast('success', '주문이 삭제되었습니다.');
    }
    setConfirmAction(null);
  };

  const openHistory = (tableId: number) => {
    setHistoryTableId(tableId);
    setShowHistory(true);
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-xl font-bold text-white mb-6">테이블 관리</h2>

        {/* 테이블 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`card cursor-pointer transition-all ${selectedTable?.id === table.id ? 'border-primary-500 ring-1 ring-primary-500/30' : 'hover:border-surface-border/80'}`}
              onClick={() => setSelectedTable(table)}
              data-testid={`table-manage-${table.tableNo}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">테이블 {table.tableNo}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${table.hasActiveSession ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/10 text-gray-500 border border-gray-500/30'}`}>
                  {table.hasActiveSession ? '사용중' : '비어있음'}
                </span>
              </div>

              {table.hasActiveSession ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">
                    주문 <span className="text-white font-medium">{table.orders.length}</span>건
                  </p>
                  <p className="text-lg font-bold text-primary-400">
                    ₩{table.totalAmount.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">대기중</p>
              )}
            </div>
          ))}
        </div>

        {/* 선택된 테이블 상세 */}
        {selectedTable && (
          <div className="mt-6 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                테이블 {selectedTable.tableNo} 상세
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openHistory(selectedTable.id)}
                  className="btn-secondary text-xs"
                >
                  과거 내역
                </button>
                {selectedTable.hasActiveSession && (
                  <button
                    onClick={() => handleComplete(selectedTable.id)}
                    className="btn-danger text-xs"
                    data-testid={`table-complete-btn-${selectedTable.tableNo}`}
                  >
                    이용 완료
                  </button>
                )}
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-500 hover:text-white px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {!selectedTable.hasActiveSession ? (
              <p className="text-gray-500 text-center py-8">현재 활성 세션이 없습니다.</p>
            ) : selectedTable.orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">주문이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {selectedTable.orders.map((order) => {
                  const next = nextStatus[order.status];
                  return (
                    <div key={order.id} className="p-3 rounded-xl bg-surface-lighter border border-surface-border" data-testid={`table-order-${order.id}`}>
                      {/* 주문 헤더 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-400">#{order.orderNumber}</span>
                          <OrderStatusBadge status={order.status} />
                          <OrderTimeIndicator createdAt={order.createdAt} status={order.status} />
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* 주문 항목 */}
                      <div className="space-y-1 mb-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{item.menuName} × {item.quantity}</span>
                            <span className="text-gray-400">₩{(item.unitPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* 주문 합계 + 액션 */}
                      <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                        <span className="text-sm font-bold text-white">₩{order.totalAmount.toLocaleString()}</span>
                        <div className="flex gap-2">
                          {next && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, next); }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/30 hover:bg-primary-500/20 transition-colors"
                              data-testid={`order-next-status-${order.id}`}
                            >
                              → {next === 'preparing' ? '준비중' : '완료'}
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id, selectedTable.id); }}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                            data-testid={`order-delete-btn-${order.id}`}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 과거 내역 모달 */}
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <div className="relative bg-surface-light border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">과거 주문 내역</h3>
                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white text-lg">✕</button>
              </div>

              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">과거 내역이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="p-3 rounded-lg bg-surface-lighter border border-surface-border">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>#{h.orderNumber}</span>
                        <span>{new Date(h.completedAt).toLocaleString('ko-KR')}</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        {h.items.map((item) => `${item.menuName}×${item.quantity}`).join(', ')}
                      </div>
                      <p className="text-sm font-bold text-white mt-1">₩{h.totalAmount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 확인 모달 */}
        <ConfirmModal
          isOpen={!!confirmAction}
          title={confirmAction?.type === 'delete-order' ? '주문 삭제' : '이용 완료'}
          message={
            confirmAction?.type === 'delete-order'
              ? '이 주문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
              : '테이블 이용 완료 처리하시겠습니까? 모든 주문이 과거 내역으로 이동됩니다.'
          }
          variant="danger"
          confirmText={confirmAction?.type === 'delete-order' ? '삭제' : '완료 처리'}
          onConfirm={executeConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      </div>
    </Layout>
  );
}
