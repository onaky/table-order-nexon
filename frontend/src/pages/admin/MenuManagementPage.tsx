import { useState } from 'react';
import { useMenus, useMenuMutation } from '@/hooks/useMenu';
import { useCategories } from '@/hooks/useCategory';
import { Menu } from '@/types';
import DragDropMenuList from '@/components/admin/DragDropMenuList';
import ConfirmModal from '@/components/common/ConfirmModal';
import ImageUploader from '@/components/common/ImageUploader';
import { showToast } from '@/components/common/Toast';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/common/Toast';

export default function MenuManagementPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { data: menus = [] } = useMenus(selectedCategoryId);
  const { data: categories = [] } = useCategories();
  const { createMenu, updateMenu, deleteMenu, reorderMenus } = useMenuMutation();

  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({ name: '', price: '', description: '', categoryId: 0, imageUrl: '' });

  const openCreateForm = () => {
    setFormData({ name: '', price: '', description: '', categoryId: categories[0]?.id ?? 0, imageUrl: '' });
    setEditingMenu(null);
    setShowForm(true);
  };

  const openEditForm = (menu: Menu) => {
    setFormData({
      name: menu.name,
      price: String(menu.price),
      description: menu.description,
      categoryId: menu.categoryId,
      imageUrl: menu.imageUrl,
    });
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      showToast('error', '필수 필드를 입력해주세요.');
      return;
    }

    const data = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl,
    };

    if (editingMenu) {
      updateMenu.mutate({ id: editingMenu.id, data }, {
        onSuccess: () => { showToast('success', '메뉴가 수정되었습니다.'); setShowForm(false); },
      });
    } else {
      createMenu.mutate(data, {
        onSuccess: () => { showToast('success', '메뉴가 등록되었습니다.'); setShowForm(false); },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMenu.mutate(deleteId, {
        onSuccess: () => { showToast('success', '메뉴가 삭제되었습니다.'); setDeleteId(null); },
      });
    }
  };

  const handleReorder = (menuIds: number[]) => {
    reorderMenus.mutate(menuIds, {
      onSuccess: () => showToast('info', '메뉴 순서가 저장되었습니다.'),
    });
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">메뉴 관리</h2>
          <button onClick={openCreateForm} className="btn-primary text-sm" data-testid="menu-add-btn">
            + 메뉴 추가
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setSelectedCategoryId(undefined)}
            className={`px-3 py-1.5 rounded-lg text-sm ${!selectedCategoryId ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white'}`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${selectedCategoryId === cat.id ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 드래그 앤 드롭 메뉴 리스트 */}
        <DragDropMenuList
          menus={menus}
          onReorder={handleReorder}
          onEdit={openEditForm}
          onDelete={(id) => setDeleteId(id)}
        />

        {/* 메뉴 폼 모달 */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative bg-surface-light border border-surface-border rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-4">
                {editingMenu ? '메뉴 수정' : '메뉴 추가'}
              </h3>

              <div className="space-y-3">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="메뉴명 *"
                  className="input-field"
                  data-testid="menu-form-name"
                />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="가격 *"
                  className="input-field"
                  data-testid="menu-form-price"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="설명"
                  className="input-field resize-none h-20"
                />
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="input-field"
                  data-testid="menu-form-category"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ImageUploader
                  currentUrl={formData.imageUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">취소</button>
                <button onClick={handleSubmit} className="btn-primary flex-1" data-testid="menu-form-submit">
                  {editingMenu ? '수정' : '등록'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 */}
        <ConfirmModal
          isOpen={!!deleteId}
          title="메뉴 삭제"
          message="이 메뉴를 삭제하시겠습니까?"
          variant="danger"
          confirmText="삭제"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}
