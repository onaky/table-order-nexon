import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest, TokenPayload, TokenType } from '../types';
import { errorResponse } from '../utils/response';

/**
 * 관리자 전용 인증 미들웨어
 * Admin Token만 허용
 */
export const adminAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (!token) {
    errorResponse(res, '인증 토큰이 필요합니다', 401);
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;

    if (payload.type !== TokenType.ADMIN) {
      errorResponse(res, '관리자 권한이 필요합니다', 403);
      return;
    }

    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      errorResponse(res, '토큰이 만료되었습니다', 401);
    } else {
      errorResponse(res, '유효하지 않은 토큰입니다', 401);
    }
  }
};

/**
 * 테이블 전용 인증 미들웨어
 * Table Token만 허용
 */
export const tableAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (!token) {
    errorResponse(res, '인증 토큰이 필요합니다', 401);
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;

    if (payload.type !== TokenType.TABLE) {
      errorResponse(res, '테이블 인증이 필요합니다', 403);
      return;
    }

    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      errorResponse(res, '토큰이 만료되었습니다', 401);
    } else {
      errorResponse(res, '유효하지 않은 토큰입니다', 401);
    }
  }
};

/**
 * 공통 인증 미들웨어 (Admin 또는 Table 모두 허용)
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (!token) {
    errorResponse(res, '인증 토큰이 필요합니다', 401);
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      errorResponse(res, '토큰이 만료되었습니다', 401);
    } else {
      errorResponse(res, '유효하지 않은 토큰입니다', 401);
    }
  }
};

/**
 * Authorization 헤더에서 Bearer 토큰 추출
 */
function extractToken(req: AuthenticatedRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
