import { AppDataSource } from '../config/database';
import { Order, OrderItem, OrderHistory, Menu, TableSession, Table } from '../entities';
import { CreateOrderDto, OrderStatus, SSENewOrderEvent, SSEStatusChangeEvent, SSEOrderDeletedEvent } from '../types';
import { SSEService } from './sse.service';

export class OrderService {
  private orderRepo = AppDataSource.getRepository(Order);
  private orderItemRepo = AppDataSource.getRepository(OrderItem);
  private orderHistoryRepo = AppDataSource.getRepository(OrderHistory);
  private menuRepo = AppDataSource.getRepository(Menu);
  private sessionRepo = AppDataSource.getRepository(TableSession);
  private tableRepo = AppDataSource.getRepository(Table);
  private sseService: SSEService;

  constructor(sseService: SSEService) {
    this.sseService = sseService;
  }

  /**
   * 주문 생성
   * - 세션 확인 → 메뉴 유효성 → 주문번호 생성 → 트랜잭션 저장 → SSE 발행
   */
  async create(
    storeId: string,
    tableId: number,
    sessionId: string,
    data: CreateOrderDto
  ): Promise<Order> {
    // 활성 세션 확인
    const session = await this.sessionRepo.findOne({
      where: { sessionId, isActive: true },
    });

    if (!session) {
      throw Object.assign(new Error('활성 세션이 없습니다'), { statusCode: 400 });
    }

    // 주문 항목 검증
    if (!data.items || data.items.length === 0) {
      throw Object.assign(new Error('최소 1개 이상의 주문 항목이 필요합니다'), { statusCode: 400 });
    }

    // 메뉴 유효성 검증
    const menuIds = data.items.map((item) => item.menuId);
    const menus = await this.menuRepo.findByIds(menuIds);

    for (const item of data.items) {
      const menu = menus.find((m) => m.id === item.menuId);
      if (!menu) {
        throw Object.assign(new Error(`메뉴를 찾을 수 없습니다 (ID: ${item.menuId})`), { statusCode: 400 });
      }
      if (!menu.isAvailable) {
        throw Object.assign(new Error(`현재 판매하지 않는 메뉴입니다: ${menu.name}`), { statusCode: 400 });
      }
      if (item.quantity < 1) {
        throw Object.assign(new Error('수량은 1 이상이어야 합니다'), { statusCode: 400 });
      }
    }

    // 주문번호 생성: {storeId}-{MMDD}-{sequence}
    const orderNumber = await this.generateOrderNumber(storeId);

    // 테이블 번호 조회
    const table = await this.tableRepo.findOne({ where: { id: tableId } });
    const tableNo = table?.tableNo ?? 0;

    // 트랜잭션으로 주문 생성
    const order = await AppDataSource.transaction(async (manager) => {
      // OrderItem 준비
      const orderItems: Partial<OrderItem>[] = data.items.map((item) => {
        const menu = menus.find((m) => m.id === item.menuId)!;
        return {
          menuId: item.menuId,
          menuName: menu.name,
          quantity: item.quantity,
          unitPrice: menu.price,
          subtotal: item.quantity * menu.price,
        };
      });

      const totalAmount = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

      // Order 생성
      const newOrder = manager.create(Order, {
        orderNumber,
        storeId,
        tableId,
        sessionId,
        status: OrderStatus.PENDING,
        totalAmount,
      });

      const savedOrder = await manager.save(Order, newOrder);

      // OrderItem 생성
      const items = orderItems.map((item) =>
        manager.create(OrderItem, { ...item, orderId: savedOrder.id })
      );
      await manager.save(OrderItem, items);

      // 관계 로드하여 반환
      savedOrder.items = items as OrderItem[];
      return savedOrder;
    });

    // SSE 이벤트 발행
    const sseEvent: SSENewOrderEvent = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNo,
      items: order.items.map((item) => ({
        menuName: item.menuName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    };
    this.sseService.broadcastOrderEvent(storeId, 'new-order', sseEvent);

    return order;
  }

  /**
   * 현재 세션 주문 조회 (고객용)
   */
  async findByTableSession(tableId: number, sessionId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { tableId, sessionId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 매장 전체 활성 주문 조회 (관리자 대시보드용)
   */
  async findByStore(storeId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { storeId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 주문 상태 변경
   * - 상태 전이 검증: pending → preparing → completed (역방향/건너뛰기 불가)
   */
  async updateStatus(id: number, storeId: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id, storeId },
    });

    if (!order) {
      throw Object.assign(new Error('주문을 찾을 수 없습니다'), { statusCode: 404 });
    }

    // 상태 전이 검증
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PREPARING],
      [OrderStatus.PREPARING]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      throw Object.assign(
        new Error(`'${order.status}'에서 '${newStatus}'로 변경할 수 없습니다`),
        { statusCode: 400 }
      );
    }

    const previousStatus = order.status;
    order.status = newStatus;
    const updatedOrder = await this.orderRepo.save(order);

    // 테이블 번호 조회
    const table = await this.tableRepo.findOne({ where: { id: order.tableId } });
    const tableNo = table?.tableNo ?? 0;

    // SSE 이벤트 발행
    const sseEvent: SSEStatusChangeEvent = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNo,
      previousStatus: previousStatus as OrderStatus,
      newStatus,
      updatedAt: updatedOrder.updatedAt,
    };
    this.sseService.broadcastOrderEvent(storeId, 'status-change', sseEvent);

    return updatedOrder;
  }

  /**
   * 주문 삭제 (관리자 전용)
   */
  async delete(id: number, storeId: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id, storeId },
    });

    if (!order) {
      throw Object.assign(new Error('주문을 찾을 수 없습니다'), { statusCode: 404 });
    }

    const deletedAmount = order.totalAmount;
    const orderNumber = order.orderNumber;

    // 테이블 번호 조회
    const table = await this.tableRepo.findOne({ where: { id: order.tableId } });
    const tableNo = table?.tableNo ?? 0;

    // CASCADE로 OrderItem도 삭제
    await this.orderRepo.remove(order);

    // SSE 이벤트 발행
    const sseEvent: SSEOrderDeletedEvent = {
      orderId: id,
      orderNumber,
      tableNo,
      deletedAmount,
    };
    this.sseService.broadcastOrderEvent(storeId, 'order-deleted', sseEvent);
  }

  /**
   * 과거 주문 이력 조회
   */
  async getHistory(storeId: string, tableId: number, date?: string): Promise<OrderHistory[]> {
    const query = this.orderHistoryRepo
      .createQueryBuilder('h')
      .where('h.storeId = :storeId AND h.tableId = :tableId', { storeId, tableId });

    if (date) {
      query.andWhere('DATE(h.completedAt) = :date', { date });
    }

    return query.orderBy('h.completedAt', 'DESC').getMany();
  }

  /**
   * 주문번호 생성: {storeId}-{MMDD}-{sequence}
   */
  private async generateOrderNumber(storeId: string): Promise<string> {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${storeId}-${month}${day}`;

    // 오늘 해당 매장의 주문 수 조회
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const count = await this.orderRepo
      .createQueryBuilder('o')
      .where('o.storeId = :storeId', { storeId })
      .andWhere('o.createdAt >= :start AND o.createdAt < :end', {
        start: todayStart,
        end: todayEnd,
      })
      .getCount();

    const sequence = String(count + 1).padStart(3, '0');
    return `${datePrefix}-${sequence}`;
  }
}
