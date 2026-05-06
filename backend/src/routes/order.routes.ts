import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware, adminAuthMiddleware, tableAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 주문 생성 (Table 전용)
router.post('/', tableAuthMiddleware, OrderController.createOrder);

// 주문 조회 (Table 또는 Admin)
router.get('/', authMiddleware, OrderController.getOrders);

// 주문 상태 변경 (Admin 전용)
router.put('/:id/status', adminAuthMiddleware, OrderController.updateOrderStatus);

// 주문 삭제 (Admin 전용)
router.delete('/:id', adminAuthMiddleware, OrderController.deleteOrder);

export { router as orderRoutes };
