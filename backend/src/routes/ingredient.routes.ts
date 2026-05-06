import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient.controller';
import { adminAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Admin 전용
router.get('/', adminAuthMiddleware, IngredientController.getIngredients);
router.post('/', adminAuthMiddleware, IngredientController.createIngredient);
router.put('/:id', adminAuthMiddleware, IngredientController.updateIngredient);
router.delete('/:id', adminAuthMiddleware, IngredientController.deleteIngredient);

export { router as ingredientRoutes };
