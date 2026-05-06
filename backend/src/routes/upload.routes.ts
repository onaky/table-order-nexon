import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { adminAuthMiddleware } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';

const router = Router();

// Admin 전용
router.post('/image', adminAuthMiddleware, uploadMiddleware, UploadController.uploadImage);
router.delete('/:filename', adminAuthMiddleware, UploadController.deleteImage);

export { router as uploadRoutes };
