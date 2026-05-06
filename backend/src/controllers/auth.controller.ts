import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';

const authService = new AuthService();

export class AuthController {
  /** POST /api/auth/table/login */
  static async postTableLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, tableNo, password } = req.body;

      if (!storeId || tableNo === undefined || !password) {
        errorResponse(res, '매장 ID, 테이블 번호, 비밀번호를 모두 입력해주세요', 400);
        return;
      }

      const result = await authService.authenticateTable(storeId, Number(tableNo), password);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/auth/admin/login */
  static async postAdminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, username, password } = req.body;

      if (!storeId || !username || !password) {
        errorResponse(res, '매장 ID, 사용자명, 비밀번호를 모두 입력해주세요', 400);
        return;
      }

      const result = await authService.authenticateAdmin(storeId, username, password);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/auth/verify */
  static async postVerifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        errorResponse(res, '토큰을 입력해주세요', 400);
        return;
      }

      const payload = authService.verifyToken(token);
      successResponse(res, { valid: true, payload });
    } catch (error) {
      next(error);
    }
  }
}
