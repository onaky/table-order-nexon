import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware, adminAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Table 또는 Admin 모두 조회 가능
router.get('/', authMiddleware, CategoryController.getCategories);

// Admin 전용
router.post('/', adminAuthMiddleware, CategoryController.createCategory);
router.put('/:id', adminAuthMiddleware, CategoryController.updateCategory);
router.delete('/:id', adminAuthMiddleware, CategoryController.deleteCategory);

export { router as categoryRoutes };
