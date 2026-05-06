import { useState } from 'react';
import { useIngredients, useIngredientMutation } from '@/hooks/useIngredient';
import { Ingredient, FlavorTag } from '@/types';
import ImageUploader from '@/components/common/ImageUploader';
import ConfirmModal from '@/components/common/ConfirmModal';
import { showToast } from '@/components/common/Toast';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/common/Toast';

const ALL_FLAVORS: FlavorTag[] = ['spicy', 'sweet', 'sour', 'salty', 'bitter', 'umami', 'mild'];

export default function IngredientManagementPage() {
  const { data: ingredients = [] } = useIngredients();
  const { createIngredient, updateIngredient, deleteIngredient } = useIngredientMutation();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    calories: '',
    flavorProfile: [] as FlavorTag[],
    isVegan: false,
  });

  const openCreate = () => {
    setFormData({ name: '', imageUrl: '', calories: '', flavorProfile: [], isVegan: false });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (ing: Ingredient) => {
    setFormData({
      name: ing.name,
      imageUrl: ing.imageUrl,
      calories: String(ing.calories),
      flavorProfile: ing.flavorProfile,
      isVegan: ing.isVegan,
    });
    setEditing(ing);
    setShowForm(true);
  };

  const toggleFlavor = (flavor: FlavorTag) => {
    setFormData((prev) => ({
      ...prev,
      flavorProfile: prev.flavorProfile.includes(flavor)
        ? prev.flavorProfile.filter((f) => f !== flavor)
        : [...prev.flavorProfile, flavor],
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.calories) {
      showToast('error', '이름과 칼로리를 입력해주세요.');
      return;
    }

    const data = {
      name: formData.name,
      imageUrl: formData.imageUrl,
      calories: Number(formData.calories),
      flavorProfile: formData.flavorProfile,
      isVegan: formData.isVegan,
    };

    if (editing) {
      updateIngredient.mutate({ id: editing.id, data }, {
        onSuccess: () => { showToast('success', '재료가 수정되었습니다.'); setShowForm(false); },
      });
    } else {
      createIngredient.mutate(data, {
        onSuccess: () => { showToast('success', '재료가 등록되었습니다.'); setShowForm(false); },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteIngredient.mutate(deleteId, {
        onSuccess: () => { showToast('success', '재료가 삭제되었습니다.'); setDeleteId(null); },
      });
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">재료 관리</h2>
          <button onClick={openCreate} className="btn-primary text-sm" data-testid="ingredient-add-btn">
            + 재료 추가
          </button>
        </div>

        {/* 재료 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="card-hover cursor-pointer text-center"
              onClick={() => openEdit(ing)}
              data-testid={`ingredient-card-${ing.id}`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-lighter mx-auto mb-2">
                <img src={ing.imageUrl} alt={ing.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium text-white">{ing.name}</p>
              <p className="text-xs text-gray-500">{ing.calories} kcal</p>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {ing.isVegan && <span className="text-[10px] text-emerald-400">🌱</span>}
                {ing.flavorProfile.slice(0, 2).map((f) => (
                  <span key={f} className="text-[10px] text-gray-500">{f}</span>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(ing.id); }}
                className="mt-2 text-xs text-red-400 hover:underline"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 폼 모달 */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative bg-surface-light border border-surface-border rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-4">
                {editing ? '재료 수정' : '재료 추가'}
              </h3>

              <div className="space-y-3">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="재료명 *"
                  className="input-field"
                  data-testid="ingredient-form-name"
                />
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="칼로리 (kcal) *"
                  className="input-field"
                  data-testid="ingredient-form-calories"
                />

                {/* 맛 프로필 */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">맛 프로필</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_FLAVORS.map((flavor) => (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => toggleFlavor(flavor)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                          formData.flavorProfile.includes(flavor)
                            ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                            : 'border-surface-border text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 비건 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVegan}
                    onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">🌱 비건 재료</span>
                </label>

                <ImageUploader
                  currentUrl={formData.imageUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">취소</button>
                <button onClick={handleSubmit} className="btn-primary flex-1" data-testid="ingredient-form-submit">
                  {editing ? '수정' : '등록'}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={!!deleteId}
          title="재료 삭제"
          message="이 재료를 삭제하시겠습니까?"
          variant="danger"
          confirmText="삭제"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}
