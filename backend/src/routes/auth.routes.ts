import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// 인증 불필요
router.post('/table/login', AuthController.postTableLogin);
router.post('/admin/login', AuthController.postAdminLogin);
router.post('/verify', AuthController.postVerifyToken);

export { router as authRoutes };
