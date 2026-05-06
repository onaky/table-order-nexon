import { useParams, useNavigate } from 'react-router-dom';
import { useMenuDetail } from '@/hooks/useMenu';
import { useCartStore } from '@/stores/cartStore';
import { showToast } from '@/components/common/Toast';
import Menu3DViewer from '@/components/menu/Menu3DViewer';
import IngredientList from '@/components/menu/IngredientList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToastContainer from '@/components/common/Toast';

export default function MenuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: menu, isLoading } = useMenuDetail(Number(id));
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!menu) return;
    addItem(menu);
    showToast('success', `${menu.name} 장바구니에 추가됨`);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!menu) return <div className="text-center py-12 text-gray-500">메뉴를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-black">
      <ToastContainer />

      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center"
          data-testid="menu-detail-back"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* 3D 뷰어 (중앙) */}
        <div className="flex-1 flex items-center justify-center p-8 pt-16">
          <div className="w-full max-w-md">
            <Menu3DViewer menuId={menu.id} imageUrl={menu.imageUrl} name={menu.name} />
          </div>
        </div>

        {/* 재료 목록 (우측) */}
        <div className="lg:w-64 p-4 lg:p-6 lg:border-l border-surface-border/30">
          <IngredientList ingredients={menu.ingredients} />
        </div>
      </div>

      {/* 하단 정보 + 장바구니 추가 */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-surface-border p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{menu.name}</h2>
            <p className="text-primary-400 font-bold">₩{menu.price.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-primary"
            data-testid="menu-detail-add-cart"
          >
            장바구니 추가
          </button>
        </div>
      </div>
    </div>
  );
}
