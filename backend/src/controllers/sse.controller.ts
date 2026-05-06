import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { sseServiceInstance } from '../services/sse.service';

export class SSEController {
  /** GET /api/sse/orders */
  static async connectStream(req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> {
    const storeId = req.user!.storeId;

    // SSE 헤더 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // nginx 프록시 버퍼링 비활성화

    // 초기 연결 확인 이벤트
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'SSE 연결 성공', storeId })}\n\n`);

    // 클라이언트 등록
    sseServiceInstance.addClient(storeId, res);

    // 연결 유지를 위한 heartbeat (30초마다)
    const heartbeat = setInterval(() => {
      res.write(`:heartbeat\n\n`);
    }, 30000);

    // 연결 해제 시 정리
    req.on('close', () => {
      clearInterval(heartbeat);
      sseServiceInstance.removeClient(storeId, res);
    });
  }
}
