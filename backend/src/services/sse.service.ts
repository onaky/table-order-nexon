import { Response } from 'express';

/**
 * SSE (Server-Sent Events) 서비스
 * 매장별 클라이언트 관리 및 이벤트 브로드캐스트
 */
export class SSEService {
  // 매장별 연결된 클라이언트 목록: Map<storeId, Response[]>
  private clients: Map<string, Response[]> = new Map();

  /**
   * SSE 클라이언트 연결 등록
   */
  addClient(storeId: string, res: Response): void {
    if (!this.clients.has(storeId)) {
      this.clients.set(storeId, []);
    }
    this.clients.get(storeId)!.push(res);

    // 연결 해제 시 자동 정리
    res.on('close', () => {
      this.removeClient(storeId, res);
    });
  }

  /**
   * SSE 클라이언트 연결 해제
   */
  removeClient(storeId: string, res: Response): void {
    const storeClients = this.clients.get(storeId);
    if (storeClients) {
      const index = storeClients.indexOf(res);
      if (index !== -1) {
        storeClients.splice(index, 1);
      }
      // 빈 배열이면 Map에서 제거
      if (storeClients.length === 0) {
        this.clients.delete(storeId);
      }
    }
  }

  /**
   * 주문 이벤트 브로드캐스트
   * 해당 매장에 연결된 모든 클라이언트에게 이벤트 전송
   */
  broadcastOrderEvent(storeId: string, eventType: string, data: any): void {
    const storeClients = this.clients.get(storeId);
    if (!storeClients || storeClients.length === 0) {
      return; // 연결된 관리자 없음
    }

    const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;

    // 전송 실패 클라이언트 수집
    const failedClients: Response[] = [];

    for (const client of storeClients) {
      try {
        client.write(message);
      } catch {
        failedClients.push(client);
      }
    }

    // 실패한 클라이언트 제거
    for (const client of failedClients) {
      this.removeClient(storeId, client);
    }
  }

  /**
   * 특정 매장의 연결된 클라이언트 수 조회
   */
  getClientCount(storeId: string): number {
    return this.clients.get(storeId)?.length ?? 0;
  }
}

// 싱글톤 인스턴스 (앱 전체에서 하나의 SSE 서비스 공유)
export const sseServiceInstance = new SSEService();
