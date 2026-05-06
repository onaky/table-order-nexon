import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientApi } from '@/api/ingredient.api';
import { CreateIngredientRequest } from '@/types';

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const res = await ingredientApi.getIngredients();
      return res.data ?? [];
    },
  });
}

export function useMenuIngredients(menuId: number) {
  return useQuery({
    queryKey: ['menu-ingredients', menuId],
    queryFn: async () => {
      const res = await ingredientApi.getMenuIngredients(menuId);
      return res.data ?? [];
    },
    enabled: !!menuId,
  });
}

export function useIngredientMutation() {
  const queryClient = useQueryClient();

  const createIngredient = useMutation({
    mutationFn: (data: CreateIngredientRequest) => ingredientApi.createIngredient(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const updateIngredient = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateIngredientRequest> }) =>
      ingredientApi.updateIngredient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const deleteIngredient = useMutation({
    mutationFn: (id: number) => ingredientApi.deleteIngredient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const linkToMenu = useMutation({
    mutationFn: ({ menuId, ingredientId }: { menuId: number; ingredientId: number }) =>
      ingredientApi.linkToMenu(menuId, ingredientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-ingredients'] }),
  });

  const unlinkFromMenu = useMutation({
    mutationFn: ({ menuId, ingredientId }: { menuId: number; ingredientId: number }) =>
      ingredientApi.unlinkFromMenu(menuId, ingredientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-ingredients'] }),
  });

  return { createIngredient, updateIngredient, deleteIngredient, linkToMenu, unlinkFromMenu };
}
