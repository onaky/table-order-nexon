import { useState } from 'react';
import { motion } from 'framer-motion';
import { TableDashboard, Order, OrderStatus } from '@/types';
import OrderTimeIndicator from './OrderTimeIndicator';
import OrderStatusBadge from './OrderStatusBadge';

interface TableCardProps {
  table: TableDashboard;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onDeleteOrder: (orderId: number) => void;
  onCompleteTable: (tableId: number) => void;
}

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing',
  preparing: 'completed',
  completed: null,
};

export default function TableCard({ table, onStatusChange, onDeleteOrder, onCompleteTable }: TableCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!table.hasActiveSession) {
    return (
      <div className="card opacity-50" data-testid={`table-card-${table.tableNo}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">테이블 {table.tableNo}</span>
          <span className="text-xs text-gray-600">비어있음</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="card border-surface-border hover:border-primary-500/30 transition-colors"
      data-testid={`table-card-${table.tableNo}`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white">테이블 {table.tableNo}</h3>
        <span className="text-sm font-bold text-primary-400">
          ₩{table.totalAmount.toLocaleString()}
        </span>
      </div>

      {/* 주문 목록 */}
      <div className="space-y-2">
        {table.orders.slice(0, expanded ? undefined : 3).map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
            onDelete={onDeleteOrder}
          />
        ))}
      </div>

      {table.orders.length > 3 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-2 text-xs text-gray-500 hover:text-primary-400 transition-colors"
        >
          +{table.orders.length - 3}개 더 보기
        </button>
      )}

      {/* 하단 액션 */}
      <div className="mt-3 pt-3 border-t border-surface-border flex gap-2">
        <button
          onClick={() => onCompleteTable(table.id)}
          className="btn-danger text-xs flex-1"
          data-testid={`table-complete-${table.tableNo}`}
        >
          이용 완료
        </button>
      </div>
    </motion.div>
  );
}

function OrderRow({
  order,
  onStatusChange,
  onDelete,
}: {
  order: Order;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onDelete: (orderId: number) => void;
}) {
  const next = nextStatus[order.status];

  return (
    <div className="p-2 rounded-lg bg-surface-lighter/50 space-y-1.5" data-testid={`order-row-${order.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <OrderTimeIndicator createdAt={order.createdAt} status={order.status} />
        </div>
        <span className="text-xs text-gray-500 font-mono">#{order.orderNumber}</span>
      </div>

      <div className="text-xs text-gray-400">
        {order.items.map((item) => `${item.menuName}×${item.quantity}`).join(', ')}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-300">₩{order.totalAmount.toLocaleString()}</span>
        <div className="flex gap-1">
          {next && (
            <button
              onClick={() => onStatusChange(order.id, next)}
              className="text-[10px] px-2 py-1 rounded bg-primary-500/10 text-primary-400 border border-primary-500/30 hover:bg-primary-500/20"
              data-testid={`order-status-change-${order.id}`}
            >
              → {next === 'preparing' ? '준비중' : '완료'}
            </button>
          )}
          <button
            onClick={() => onDelete(order.id)}
            className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
            data-testid={`order-delete-${order.id}`}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
