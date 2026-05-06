import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { useSSE } from '@/hooks/useSSE';
import { OrderStatus } from '@/types';
import TableCard from '@/components/order/TableCard';
import SalesChart from '@/components/admin/SalesChart';
import ConfirmModal from '@/components/common/ConfirmModal';
import { showToast } from '@/components/common/Toast';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/common/Toast';

export default function DashboardPage() {
  const adminInfo = useAuthStore((s) => s.adminInfo);
  const { tables, updateOrderStatus, deleteOrder, completeTable, connected } = useOrderStore();
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: number } | null>(null);

  // SSE 연결 (목업 모드에서는 storeId 없어도 동작)
  useSSE(adminInfo?.storeId ?? null);

  const handleStatusChange = (orderId: number, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    showToast('success', '주문 상태가 변경되었습니다.');
  };

  const handleDeleteOrder = (orderId: number) => {
    setConfirmAction({ type: 'delete-order', id: orderId });
  };

  const handleCompleteTable = (tableId: number) => {
    setConfirmAction({ type: 'complete-table', id: tableId });
  };

  const executeConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete-order') {
      const table = tables.find((t) => t.orders.some((o) => o.id === confirmAction.id));
      if (table) {
        deleteOrder(confirmAction.id, table.id);
        showToast('success', '주문이 삭제되었습니다.');
      }
    } else if (confirmAction.type === 'complete-table') {
      completeTable(confirmAction.id);
      showToast('success', '테이블 이용 완료 처리되었습니다.');
    }
    setConfirmAction(null);
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 연결 상태 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-500">
            {connected ? '실시간 연결됨' : '연결 끊김'}
          </span>
        </div>

        {/* 매출 차트 */}
        <SalesChart tables={tables} />

        {/* 테이블 그리드 */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">테이블 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="dashboard-grid">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onStatusChange={handleStatusChange}
                onDeleteOrder={handleDeleteOrder}
                onCompleteTable={handleCompleteTable}
              />
            ))}
          </div>
        </div>
      </div>

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
    </Layout>
  );
}
