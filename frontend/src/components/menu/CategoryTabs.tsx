import { motion } from 'framer-motion';
import { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" data-testid="category-tabs">
      <button
        onClick={() => onSelect(null)}
        className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          activeId === null ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
        data-testid="category-tab-all"
      >
        전체
        {activeId === null && (
          <motion.div
            layoutId="category-indicator"
            className="absolute inset-0 bg-primary-500/20 border border-primary-500/50 rounded-full -z-10"
          />
        )}
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeId === cat.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
          data-testid={`category-tab-${cat.id}`}
        >
          {cat.name}
          {activeId === cat.id && (
            <motion.div
              layoutId="category-indicator"
              className="absolute inset-0 bg-primary-500/20 border border-primary-500/50 rounded-full -z-10"
            />
          )}
        </button>
      ))}
    </div>
  );
}
