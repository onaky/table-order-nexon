import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/api/menu.api';
import { CreateMenuRequest, UpdateMenuRequest } from '@/types';

export function useMenus(categoryId?: number) {
  return useQuery({
    queryKey: ['menus', categoryId],
    queryFn: async () => {
      const res = await menuApi.getMenus(categoryId);
      return res.data ?? [];
    },
  });
}

export function useMenuDetail(id: number) {
  return useQuery({
    queryKey: ['menu', id],
    queryFn: async () => {
      const res = await menuApi.getMenuById(id);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useMenuMutation() {
  const queryClient = useQueryClient();

  const createMenu = useMutation({
    mutationFn: (data: CreateMenuRequest) => menuApi.createMenu(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menus'] }),
  });

  const updateMenu = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMenuRequest }) =>
      menuApi.updateMenu(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menus'] }),
  });

  const deleteMenu = useMutation({
    mutationFn: (id: number) => menuApi.deleteMenu(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menus'] }),
  });

  const reorderMenus = useMutation({
    mutationFn: (menuIds: number[]) => menuApi.reorderMenus({ menuIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menus'] }),
  });

  return { createMenu, updateMenu, deleteMenu, reorderMenus };
}
