import { Router } from 'express';
import { SSEController } from '../controllers/sse.controller';
import { adminAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Admin 전용 SSE 스트림
router.get('/orders', adminAuthMiddleware, SSEController.connectStream);

export { router as sseRoutes };
