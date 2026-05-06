import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { showToast } from '@/components/common/Toast';

interface MenuCardProps {
  menu: Menu;
}

export default function MenuCard({ menu }: MenuCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menu);
    showToast('success', `${menu.name} 추가됨`);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/customer/menu/${menu.id}`)}
      className="card-hover cursor-pointer overflow-hidden"
      data-testid={`menu-card-${menu.id}`}
    >
      {/* 이미지 */}
      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-surface-lighter">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 정보 */}
      <div className="space-y-1">
        <h3 className="font-medium text-white text-sm line-clamp-1">{menu.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2">{menu.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-primary-400 font-bold text-sm">
            ₩{menu.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/30 flex items-center justify-center hover:bg-primary-500/20 transition-colors"
            data-testid={`menu-card-add-${menu.id}`}
          >
            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
