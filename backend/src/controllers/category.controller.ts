import { Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { AuthenticatedRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

const categoryService = new CategoryService();

export class CategoryController {
  /** GET /api/categories */
  static async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const categories = await categoryService.findAll(storeId);
      successResponse(res, categories);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/categories */
  static async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const { name, sortOrder } = req.body;

      if (!name || name.trim().length === 0) {
        errorResponse(res, '카테고리명을 입력해주세요', 400);
        return;
      }

      const category = await categoryService.create(storeId, { name: name.trim(), sortOrder });
      successResponse(res, category, 201);
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/categories/:id */
  static async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);
      const { name, sortOrder } = req.body;

      const category = await categoryService.update(id, storeId, { name, sortOrder });
      successResponse(res, category);
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/categories/:id */
  static async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      await categoryService.delete(id, storeId);
      successResponse(res, { message: '카테고리가 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  }
}
