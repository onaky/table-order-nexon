import { AppDataSource } from '../config/database';
import { Table, TableSession, Order, OrderItem, OrderHistory } from '../entities';
import { SetupTableDto, SSETableCompletedEvent } from '../types';
import { AuthService } from './auth.service';
import { SSEService } from './sse.service';

export class TableService {
  private tableRepo = AppDataSource.getRepository(Table);
  private sessionRepo = AppDataSource.getRepository(TableSession);
  private orderRepo = AppDataSource.getRepository(Order);
  private orderHistoryRepo = AppDataSource.getRepository(OrderHistory);
  private authService = new AuthService();
  private sseService: SSEService;

  constructor(sseService: SSEService) {
    this.sseService = sseService;
  }

  /**
   * 매장별 테이블 전체 조회
   */
  async findAll(storeId: string): Promise<Table[]> {
    return this.tableRepo.find({
      where: { storeId },
      order: { tableNo: 'ASC' },
    });
  }

  /**
   * 테이블 초기 설정
   * - 기존 테이블이 있으면 비밀번호 업데이트
   * - 없으면 새 테이블 생성
   */
  async setup(storeId: string, data: SetupTableDto): Promise<Table> {
    // 비밀번호 최소 길이 검증
    if (!data.password || data.password.length < 4) {
      throw Object.assign(new Error('비밀번호는 최소 4자 이상이어야 합니다'), { statusCode: 400 });
    }

    const hashedPassword = await this.authService.hashPassword(data.password);

    // 기존 테이블 확인
    let table = await this.tableRepo.findOne({
      where: { storeId, tableNo: data.tableNo },
    });

    if (table) {
      // 기존 테이블 비밀번호 업데이트
      table.password = hashedPassword;
      table.isActive = true;
    } else {
      // 새 테이블 생성
      table = this.tableRepo.create({
        storeId,
        tableNo: data.tableNo,
        password: hashedPassword,
        isActive: true,
      });
    }

    return this.tableRepo.save(table);
  }

  /**
   * 테이블 이용 완료 (세션 종료)
   * 트랜잭션:
   * 1. 현재 세션의 모든 주문 → OrderHistory로 이동
   * 2. Order + OrderItem 삭제
   * 3. TableSession 종료 (endedAt, isActive=false)
   */
  async completeSession(tableId: number, storeId: string): Promise<void> {
    // 활성 세션 확인
    const session = await this.sessionRepo.findOne({
      where: { tableId, isActive: true },
    });

    if (!session) {
      throw Object.assign(new Error('활성 세션이 없습니다'), { statusCode: 400 });
    }

    // 테이블 번호 조회
    const table = await this.tableRepo.findOne({ where: { id: tableId } });
    const tableNo = table?.tableNo ?? 0;

    // 트랜잭션으로 이력 이동 + 삭제 + 세션 종료
    await AppDataSource.transaction(async (manager) => {
      // 현재 세션의 모든 주문 조회
      const orders = await manager.find(Order, {
        where: { sessionId: session.sessionId },
        relations: ['items'],
      });

      // 각 주문 → OrderHistory로 이동
      const now = new Date();
      for (const order of orders) {
        const history = manager.create(OrderHistory, {
          orderNumber: order.orderNumber,
          storeId: order.storeId,
          tableId: order.tableId,
          tableNo,
          sessionId: order.sessionId,
          status: order.status,
          totalAmount: order.totalAmount,
          items: order.items.map((item) => ({
            menuName: item.menuName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
          orderedAt: order.createdAt,
          completedAt: now,
        });
        await manager.save(OrderHistory, history);
      }

      // Order 삭제 (CASCADE로 OrderItem도 삭제)
      if (orders.length > 0) {
        const orderIds = orders.map((o) => o.id);
        await manager.delete(Order, orderIds);
      }

      // 세션 종료
      session.endedAt = now;
      session.isActive = false;
      await manager.save(TableSession, session);
    });

    // SSE 이벤트 발행
    const sseEvent: SSETableCompletedEvent = {
      tableId,
      tableNo,
      sessionId: session.sessionId,
      completedAt: new Date(),
    };
    this.sseService.broadcastOrderEvent(storeId, 'table-completed', sseEvent);
  }

  /**
   * 현재 활성 세션 조회
   */
  async getCurrentSession(tableId: number): Promise<TableSession | null> {
    return this.sessionRepo.findOne({
      where: { tableId, isActive: true },
    });
  }

  /**
   * 새 세션 생성 (내부 사용)
   */
  async createSession(tableId: number, storeId: string, sessionId: string): Promise<TableSession> {
    const session = this.sessionRepo.create({
      sessionId,
      tableId,
      storeId,
      isActive: true,
    });
    return this.sessionRepo.save(session);
  }
}
