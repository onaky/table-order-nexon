import { Response, NextFunction } from 'express';
import { IngredientService } from '../services/ingredient.service';
import { AuthenticatedRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

const ingredientService = new IngredientService();

export class IngredientController {
  /** GET /api/ingredients */
  static async getIngredients(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const ingredients = await ingredientService.findAll(storeId);
      successResponse(res, ingredients);
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/menus/:menuId/ingredients */
  static async getMenuIngredients(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const menuId = Number(req.params.menuId);
      const ingredients = await ingredientService.findByMenu(menuId);
      successResponse(res, ingredients);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/ingredients */
  static async createIngredient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const { name, imageUrl, calories, flavor, isVegan, allergyInfo } = req.body;

      if (!name || name.trim().length === 0) {
        errorResponse(res, '재료명을 입력해주세요', 400);
        return;
      }

      const ingredient = await ingredientService.create(storeId, {
        name: name.trim(),
        imageUrl,
        calories: calories ? Number(calories) : undefined,
        flavor,
        isVegan,
        allergyInfo,
      });
      successResponse(res, ingredient, 201);
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/ingredients/:id */
  static async updateIngredient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      const ingredient = await ingredientService.update(id, storeId, req.body);
      successResponse(res, ingredient);
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/ingredients/:id */
  static async deleteIngredient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      await ingredientService.delete(id, storeId);
      successResponse(res, { message: '재료가 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/menus/:menuId/ingredients/:ingredientId */
  static async linkToMenu(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const menuId = Number(req.params.menuId);
      const ingredientId = Number(req.params.ingredientId);

      await ingredientService.linkToMenu(menuId, ingredientId, storeId);
      successResponse(res, { message: '재료가 연결되었습니다' }, 201);
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/menus/:menuId/ingredients/:ingredientId */
  static async unlinkFromMenu(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const menuId = Number(req.params.menuId);
      const ingredientId = Number(req.params.ingredientId);

      await ingredientService.unlinkFromMenu(menuId, ingredientId);
      successResponse(res, { message: '재료 연결이 해제되었습니다' });
    } catch (error) {
      next(error);
    }
  }
}
