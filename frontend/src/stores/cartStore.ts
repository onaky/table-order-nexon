import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Menu } from '@/types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;

  addItem: (menu: Menu) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => ({
  totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalAmount: 0,
      itemCount: 0,

      addItem: (menu: Menu) =>
        set((state) => {
          const existing = state.items.find((item) => item.menuId === menu.id);
          let newItems: CartItem[];

          if (existing) {
            newItems = state.items.map((item) =>
              item.menuId === menu.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          } else {
            newItems = [
              ...state.items,
              {
                menuId: menu.id,
                name: menu.name,
                price: menu.price,
                imageUrl: menu.imageUrl,
                quantity: 1,
              },
            ];
          }

          return { items: newItems, ...calculateTotals(newItems) };
        }),

      removeItem: (menuId: number) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.menuId !== menuId);
          return { items: newItems, ...calculateTotals(newItems) };
        }),

      updateQuantity: (menuId: number, quantity: number) =>
        set((state) => {
          if (quantity < 1) {
            const newItems = state.items.filter((item) => item.menuId !== menuId);
            return { items: newItems, ...calculateTotals(newItems) };
          }

          const newItems = state.items.map((item) =>
            item.menuId === menuId ? { ...item, quantity } : item,
          );
          return { items: newItems, ...calculateTotals(newItems) };
        }),

      clearCart: () =>
        set({ items: [], totalAmount: 0, itemCount: 0 }),
    }),
    {
      name: 'cart-storage',
    },
  ),
);
