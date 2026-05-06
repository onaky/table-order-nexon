import { useState } from 'react';
import { useMenus } from '@/hooks/useMenu';
import { useCategories } from '@/hooks/useCategory';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuCard from '@/components/menu/MenuCard';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MenuPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: menus = [], isLoading: menuLoading } = useMenus(activeCategoryId ?? undefined);

  const isLoading = catLoading || menuLoading;

  return (
    <Layout>
      <div className="px-4 py-4 space-y-4">
        {/* 카테고리 탭 */}
        {!catLoading && (
          <CategoryTabs
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        )}

        {/* 메뉴 그리드 */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-3" data-testid="menu-grid">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>
        )}

        {!isLoading && menus.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">이 카테고리에 메뉴가 없습니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
