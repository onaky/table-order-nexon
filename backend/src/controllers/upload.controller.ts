import { Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { AuthenticatedRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

const uploadService = new UploadService();

export class UploadController {
  /** POST /api/uploads/image */
  static async uploadImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        errorResponse(res, '이미지 파일을 선택해주세요', 400);
        return;
      }

      const imageUrl = uploadService.saveImage(req.file);
      successResponse(res, { imageUrl }, 201);
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/uploads/:filename */
  static async deleteImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { filename } = req.params;

      if (!filename) {
        errorResponse(res, '파일명을 입력해주세요', 400);
        return;
      }

      await uploadService.deleteImage(`/uploads/${filename}`);
      successResponse(res, { message: '이미지가 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  }
}
