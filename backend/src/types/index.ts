import { Request } from 'express';

// ============================================
// Enums
// ============================================

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  COMPLETED = 'completed',
}

export enum TokenType {
  TABLE = 'table',
  ADMIN = 'admin',
}

export enum Flavor {
  SPICY = '매운맛',
  SWEET = '단맛',
  SALTY = '짠맛',
  SOUR = '신맛',
  UMAMI = '감칠맛',
  BITTER = '쓴맛',
}

// ============================================
// JWT Payload Types
// ============================================

export interface TableTokenPayload {
  type: TokenType.TABLE;
  storeId: string;
  tableId: number;
  tableNo: number;
  sessionId: string;
}

export interface AdminTokenPayload {
  type: TokenType.ADMIN;
  storeId: string;
  adminId: number;
  username: string;
}

export type TokenPayload = TableTokenPayload | AdminTokenPayload;

// ============================================
// Request Extensions
// ============================================

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// ============================================
// DTOs
// ============================================

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  menuId: number;
  quantity: number;
}

export interface SetupTableDto {
  tableNo: number;
  password: string;
}

export interface CreateMenuDto {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  imageUrl?: string;
}

export interface UpdateMenuDto {
  name?: string;
  price?: number;
  description?: string;
  categoryId?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  sortOrder?: number;
}

export interface CreateIngredientDto {
  name: string;
  imageUrl?: string;
  calories?: number;
  flavor?: string;
  isVegan?: boolean;
  allergyInfo?: string;
}

export interface UpdateIngredientDto {
  name?: string;
  imageUrl?: string;
  calories?: number;
  flavor?: string;
  isVegan?: boolean;
  allergyInfo?: string;
}

// ============================================
// SSE Event Types
// ============================================

export interface SSENewOrderEvent {
  orderId: number;
  orderNumber: string;
  tableNo: number;
  items: { menuName: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  createdAt: Date;
}

export interface SSEStatusChangeEvent {
  orderId: number;
  orderNumber: string;
  tableNo: number;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  updatedAt: Date;
}

export interface SSEOrderDeletedEvent {
  orderId: number;
  orderNumber: string;
  tableNo: number;
  deletedAmount: number;
}

export interface SSETableCompletedEvent {
  tableId: number;
  tableNo: number;
  sessionId: string;
  completedAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
