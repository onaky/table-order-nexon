import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OrderStatus } from '@/types';

interface OrderTimeIndicatorProps {
  createdAt: string;
  status: OrderStatus;
}

function getElapsedMinutes(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

function getTimeLabel(createdAt: string): string {
  const minutes = getElapsedMinutes(createdAt);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  return `${Math.floor(minutes / 60)}시간 전`;
}

function getTimeColor(minutes: number): 'green' | 'yellow' | 'red' {
  if (minutes < 5) return 'green';
  if (minutes < 10) return 'yellow';
  return 'red';
}

const colorClasses = {
  green: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  yellow: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  red: 'text-red-400 border-red-400/30 bg-red-400/5',
};

export default function OrderTimeIndicator({ createdAt, status }: OrderTimeIndicatorProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (status === 'completed') return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'completed') return null;

  const minutes = getElapsedMinutes(createdAt);
  const color = getTimeColor(minutes);
  const label = getTimeLabel(createdAt);
  const isWarning = color === 'red';

  const indicator = (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      data-testid="order-time-indicator"
    >
      <span className="text-[10px]">⏱</span>
      {label}
    </span>
  );

  if (isWarning) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 0 rgba(239,68,68,0)',
            '0 0 12px rgba(239,68,68,0.4)',
            '0 0 0 rgba(239,68,68,0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="inline-block rounded-full"
      >
        {indicator}
      </motion.div>
    );
  }

  return indicator;
}
