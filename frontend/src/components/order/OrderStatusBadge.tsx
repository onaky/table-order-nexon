import { motion } from 'framer-motion';
import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: '대기중', className: 'badge-pending' },
  preparing: { label: '준비중', className: 'badge-preparing' },
  completed: { label: '완료', className: 'badge-completed' },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <motion.span
      key={status}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={config.className}
      data-testid={`order-status-${status}`}
    >
      {status === 'completed' && (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {config.label}
    </motion.span>
  );
}
