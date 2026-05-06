import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber || '---';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/customer/menu', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        {/* 체크 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-2">주문 완료!</h1>
        <p className="text-gray-400 mb-6">주문이 성공적으로 접수되었습니다.</p>

        <div className="card inline-block px-8 py-4 mb-6">
          <p className="text-xs text-gray-500 mb-1">주문 번호</p>
          <p className="text-2xl font-bold text-primary-400" data-testid="order-success-number">
            {orderNumber}
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {countdown}초 후 메뉴 화면으로 이동합니다...
        </p>

        <button
          onClick={() => navigate('/customer/menu', { replace: true })}
          className="mt-4 text-primary-400 text-sm hover:underline"
        >
          바로 이동
        </button>
      </motion.div>
    </div>
  );
}
