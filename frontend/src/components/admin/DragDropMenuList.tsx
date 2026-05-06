import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Menu } from '@/types';

interface DragDropMenuListProps {
  menus: Menu[];
  onReorder: (menuIds: number[]) => void;
  onEdit: (menu: Menu) => void;
  onDelete: (menuId: number) => void;
}

function SortableMenuItem({ menu, onEdit, onDelete }: { menu: Menu; onEdit: (m: Menu) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card flex items-center gap-3 ${isDragging ? 'shadow-lg shadow-primary-500/10' : ''}`}
      data-testid={`dnd-menu-${menu.id}`}
    >
      {/* 드래그 핸들 */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300"
        data-testid={`dnd-handle-${menu.id}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </button>

      {/* 이미지 */}
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-lighter flex-shrink-0">
        <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{menu.name}</p>
        <p className="text-xs text-primary-400">₩{menu.price.toLocaleString()}</p>
      </div>

      {/* 액션 */}
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(menu)}
          className="p-1.5 rounded-lg hover:bg-surface-lighter text-gray-400 hover:text-white transition-colors"
          data-testid={`dnd-edit-${menu.id}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(menu.id)}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
          data-testid={`dnd-delete-${menu.id}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function DragDropMenuList({ menus, onReorder, onEdit, onDelete }: DragDropMenuListProps) {
  const [items, setItems] = useState(menus);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder(newItems.map((i) => i.id));
  };

  // 외부에서 menus가 변경되면 동기화
  if (JSON.stringify(menus.map((m) => m.id)) !== JSON.stringify(items.map((i) => i.id))) {
    setItems(menus);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2" data-testid="dnd-menu-list">
          {items.map((menu) => (
            <SortableMenuItem key={menu.id} menu={menu} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
