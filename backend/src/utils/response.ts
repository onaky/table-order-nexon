import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * 성공 응답 헬퍼
 */
export const successResponse = <T>(res: Response, data: T, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
};

/**
 * 에러 응답 헬퍼
 */
export const errorResponse = (res: Response, message: string, statusCode: number = 400): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  res.status(statusCode).json(response);
};
