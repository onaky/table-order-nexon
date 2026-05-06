import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { useSSE } from '@/hooks/useSSE';
import { useOrderHistory } from '@/hooks/useOrder';
import ConfirmModal from '@/components/common/ConfirmModal';
import { showToast } from '@/components/common/Toast';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/common/Toast';

export default function TableManagementPage() {
  const adminInfo = useAuthStore((s) => s.adminInfo);
  const { tables, completeTable } = useOrderStore();
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmTableId, setConfirmTableId] = useState<number | null>(null);

  useSSE(adminInfo?.storeId ?? null);

  const { data: history = [] } = useOrderHistory(selectedTableId ?? 0);

  const handleComplete = (tableId: number) => {
    setConfirmTableId(tableId);
  };

  const executeComplete = () => {
    if (confirmTableId) {
      completeTable(confirmTableId);
      showToast('success', '테이블 이용 완료 처리되었습니다.');
      setConfirmTableId(null);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-xl font-bold text-white mb-6">테이블 관리</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="card" data-testid={`table-manage-${table.tableNo}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">테이블 {table.tableNo}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${table.hasActiveSession ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>
                  {table.hasActiveSession ? '사용중' : '비어있음'}
                </span>
              </div>

              {table.hasActiveSession && (
                <>
                  <p className="text-sm text-gray-400 mb-1">
                    주문 {table.orders.length}건 · ₩{table.totalAmount.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleComplete(table.id)}
                      className="btn-danger text-xs flex-1"
                      data-testid={`table-complete-btn-${table.tableNo}`}
                    >
                      이용 완료
                    </button>
                    <button
                      onClick={() => { setSelectedTableId(table.id); setShowHistory(true); }}
                      className="btn-secondary text-xs flex-1"
                    >
                      과거 내역
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 과거 내역 모달 */}
        {showHistory && selectedTableId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <div className="relative bg-surface-light border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">과거 주문 내역</h3>
                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white">✕</button>
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

        <ConfirmModal
          isOpen={!!confirmTableId}
          title="이용 완료"
          message="테이블 이용 완료 처리하시겠습니까? 모든 주문이 과거 내역으로 이동됩니다."
          variant="danger"
          confirmText="완료 처리"
          onConfirm={executeComplete}
          onCancel={() => setConfirmTableId(null)}
        />
      </div>
    </Layout>
  );
}
