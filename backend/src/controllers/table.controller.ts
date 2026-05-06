import { Response, NextFunction } from 'express';
import { TableService } from '../services/table.service';
import { AuthenticatedRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { sseServiceInstance } from '../services/sse.service';

const tableService = new TableService(sseServiceInstance);

export class TableController {
  /** GET /api/tables */
  static async getTables(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const tables = await tableService.findAll(storeId);
      successResponse(res, tables);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/tables/setup */
  static async setupTable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const { tableNo, password } = req.body;

      if (tableNo === undefined || tableNo === null) {
        errorResponse(res, '테이블 번호를 입력해주세요', 400);
        return;
      }
      if (!password) {
        errorResponse(res, '비밀번호를 입력해주세요', 400);
        return;
      }

      const table = await tableService.setup(storeId, { tableNo: Number(tableNo), password });
      successResponse(res, table, 201);
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/tables/:id/complete */
  static async completeTable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const tableId = Number(req.params.id);

      await tableService.completeSession(tableId, storeId);
      successResponse(res, { message: '테이블 이용 완료 처리되었습니다' });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/tables/:id/session */
  static async getTableSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tableId = Number(req.params.id);
      const session = await tableService.getCurrentSession(tableId);
      successResponse(res, session);
    } catch (error) {
      next(error);
    }
  }
}
