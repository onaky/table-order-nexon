import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { IngredientController } from '../controllers/ingredient.controller';
import { authMiddleware, adminAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Table 또는 Admin 모두 조회 가능
router.get('/', authMiddleware, MenuController.getMenus);
router.get('/:id', authMiddleware, MenuController.getMenuById);
router.get('/:menuId/ingredients', authMiddleware, IngredientController.getMenuIngredients);

// Admin 전용
router.post('/', adminAuthMiddleware, MenuController.createMenu);
router.put('/reorder', adminAuthMiddleware, MenuController.reorderMenus);
router.put('/:id', adminAuthMiddleware, MenuController.updateMenu);
router.delete('/:id', adminAuthMiddleware, MenuController.deleteMenu);

// 메뉴-재료 연결 (Admin 전용)
router.post('/:menuId/ingredients/:ingredientId', adminAuthMiddleware, IngredientController.linkToMenu);
router.delete('/:menuId/ingredients/:ingredientId', adminAuthMiddleware, IngredientController.unlinkFromMenu);

export { router as menuRoutes };
