import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let addToastFn: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

export function showToast(type: ToastMessage['type'], message: string) {
  addToastFn?.({ type, message });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (msg) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { ...msg, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, msg.type === 'error' ? 4000 : 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-primary-500/10 border-primary-500/30 text-primary-400',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2" data-testid="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`px-4 py-3 rounded-xl border backdrop-blur-sm ${bgColors[toast.type]}`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
