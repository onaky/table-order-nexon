import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { config } from '../config';

/**
 * 전역 에러 핸들러 미들웨어
 * 모든 미처리 에러를 잡아서 표준 응답 형식으로 반환
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 개발 환경에서만 에러 상세 로깅
  if (config.nodeEnv === 'development') {
    console.error('❌ Error:', err);
  }

  // TypeORM 중복 키 에러
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    const response: ApiResponse = {
      success: false,
      error: '이미 존재하는 데이터입니다',
    };
    res.status(409).json(response);
    return;
  }

  // TypeORM 외래키 제약 위반
  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
    const response: ApiResponse = {
      success: false,
      error: '연관된 데이터가 존재하여 삭제할 수 없습니다',
    };
    res.status(400).json(response);
    return;
  }

  // Multer 파일 크기 초과
  if (err.code === 'LIMIT_FILE_SIZE') {
    const response: ApiResponse = {
      success: false,
      error: '파일 크기는 5MB 이하여야 합니다',
    };
    res.status(400).json(response);
    return;
  }

  // Multer 파일 타입 에러
  if (err.message === 'INVALID_FILE_TYPE') {
    const response: ApiResponse = {
      success: false,
      error: '이미지 파일만 업로드 가능합니다 (jpeg, png, gif, webp)',
    };
    res.status(400).json(response);
    return;
  }

  // 기본 서버 에러
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? '서버 오류가 발생했습니다'
    : err.message || '요청을 처리할 수 없습니다';

  const response: ApiResponse = {
    success: false,
    error: message,
  };
  res.status(statusCode).json(response);
};
