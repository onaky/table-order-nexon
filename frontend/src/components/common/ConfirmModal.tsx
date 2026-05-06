import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-primary-500 hover:bg-primary-600 text-white';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-testid="confirm-modal"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-surface-light border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-xl bg-surface-lighter border border-surface-border text-gray-300 font-medium hover:bg-surface-border transition-colors"
                data-testid="confirm-modal-cancel"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${confirmBtnClass}`}
                data-testid="confirm-modal-confirm"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
