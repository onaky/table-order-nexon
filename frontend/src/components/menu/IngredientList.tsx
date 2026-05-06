import { Ingredient } from '@/types';

interface IngredientListProps {
  ingredients: Ingredient[];
}

const flavorEmoji: Record<string, string> = {
  spicy: '🌶️',
  sweet: '🍯',
  sour: '🍋',
  salty: '🧂',
  bitter: '☕',
  umami: '🍖',
  mild: '🌿',
};

export default function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-sm">재료 정보 준비중</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2" data-testid="ingredient-list">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">재료 구성</h3>

      {ingredients.map((ingredient) => (
        <div
          key={ingredient.id}
          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-lighter/50 border border-surface-border/50"
          data-testid={`ingredient-${ingredient.id}`}
        >
          {/* 원형 이미지 */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-border flex-shrink-0">
            <img
              src={ingredient.imageUrl}
              alt={ingredient.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 정보 */}
          <div className="text-center">
            <p className="text-white text-xs font-medium">{ingredient.name}</p>
            <p className="text-gray-500 text-[10px]">{ingredient.calories} kcal</p>
          </div>

          {/* 맛 태그 */}
          <div className="flex flex-wrap gap-1 justify-center">
            {ingredient.flavorProfile.map((flavor) => (
              <span
                key={flavor}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-border/50 text-gray-400"
              >
                {flavorEmoji[flavor] || ''} {flavor}
              </span>
            ))}
            {ingredient.isVegan && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                🌱 vegan
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
