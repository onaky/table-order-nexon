import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { menuRoutes } from './menu.routes';
import { ingredientRoutes } from './ingredient.routes';
import { orderRoutes } from './order.routes';
import { tableRoutes } from './table.routes';
import { uploadRoutes } from './upload.routes';
import { sseRoutes } from './sse.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/menus', menuRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/orders', orderRoutes);
router.use('/tables', tableRoutes);
router.use('/uploads', uploadRoutes);
router.use('/sse', sseRoutes);

export { router as routes };
