import { Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';
import { AuthenticatedRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

const menuService = new MenuService();

export class MenuController {
  /** GET /api/menus */
  static async getMenus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

      const menus = await menuService.findAll(storeId, categoryId);
      successResponse(res, menus);
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/menus/:id */
  static async getMenuById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      const menu = await menuService.findById(id, storeId);
      successResponse(res, menu);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/menus */
  static async createMenu(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const { name, price, description, categoryId, imageUrl } = req.body;

      if (!name || name.trim().length === 0) {
        errorResponse(res, '메뉴명을 입력해주세요', 400);
        return;
      }
      if (price === undefined || price === null) {
        errorResponse(res, '가격을 입력해주세요', 400);
        return;
      }
      if (!categoryId) {
        errorResponse(res, '카테고리를 선택해주세요', 400);
        return;
      }

      const menu = await menuService.create(storeId, {
        name: name.trim(),
        price: Number(price),
        description,
        categoryId: Number(categoryId),
        imageUrl,
      });
      successResponse(res, menu, 201);
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/menus/:id */
  static async updateMenu(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      const menu = await menuService.update(id, storeId, req.body);
      successResponse(res, menu);
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/menus/:id */
  static async deleteMenu(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      await menuService.delete(id, storeId);
      successResponse(res, { message: '메뉴가 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/menus/reorder */
  static async reorderMenus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const { menuIds } = req.body;

      if (!menuIds || !Array.isArray(menuIds) || menuIds.length === 0) {
        errorResponse(res, '메뉴 ID 목록을 입력해주세요', 400);
        return;
      }

      await menuService.reorder(storeId, menuIds);
      successResponse(res, { message: '메뉴 순서가 변경되었습니다' });
    } catch (error) {
      next(error);
    }
  }
}
