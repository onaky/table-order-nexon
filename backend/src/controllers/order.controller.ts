import { Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest, TokenType, TableTokenPayload, OrderStatus } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { sseServiceInstance } from '../services/sse.service';

const orderService = new OrderService(sseServiceInstance);

export class OrderController {
  /** POST /api/orders */
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as TableTokenPayload;
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        errorResponse(res, '주문 항목을 입력해주세요', 400);
        return;
      }

      const order = await orderService.create(
        user.storeId,
        user.tableId,
        user.sessionId,
        { items }
      );
      successResponse(res, order, 201);
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/orders (고객: 세션별 / 관리자: 매장 전체) */
  static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;

      if (user.type === TokenType.TABLE) {
        const tableUser = user as TableTokenPayload;
        const orders = await orderService.findByTableSession(tableUser.tableId, tableUser.sessionId);
        successResponse(res, orders);
      } else {
        const orders = await orderService.findByStore(user.storeId);
        successResponse(res, orders);
      }
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/orders/:id/status */
  static async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        errorResponse(res, '유효한 주문 상태를 입력해주세요 (pending, preparing, completed)', 400);
        return;
      }

      const order = await orderService.updateStatus(id, storeId, status as OrderStatus);
      successResponse(res, order);
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/orders/:id */
  static async deleteOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const id = Number(req.params.id);

      await orderService.delete(id, storeId);
      successResponse(res, { message: '주문이 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/tables/:tableId/history */
  static async getOrderHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const tableId = Number(req.params.tableId);
      const date = req.query.date as string | undefined;

      const history = await orderService.getHistory(storeId, tableId, date);
      successResponse(res, history);
    } catch (error) {
      next(error);
    }
  }
}
