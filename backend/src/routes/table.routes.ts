import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { OrderController } from '../controllers/order.controller';
import { adminAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Admin 전용
router.get('/', adminAuthMiddleware, TableController.getTables);
router.post('/setup', adminAuthMiddleware, TableController.setupTable);
router.post('/:id/complete', adminAuthMiddleware, TableController.completeTable);
router.get('/:id/session', adminAuthMiddleware, TableController.getTableSession);
router.get('/:tableId/history', adminAuthMiddleware, OrderController.getOrderHistory);

export { router as tableRoutes };
