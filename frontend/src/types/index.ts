// ===== 매장 & 인증 =====

export interface Store {
  id: string;
  name: string;
}

export interface Admin {
  id: number;
  storeId: string;
  username: string;
}

export interface TableInfo {
  id: number;
  storeId: string;
  tableNo: number;
  sessionId: string | null;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
}

// ===== 카테고리 & 메뉴 =====

export interface Category {
  id: number;
  storeId: string;
  name: string;
  sortOrder: number;
}

export interface Menu {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

export interface MenuDetail extends Menu {
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: number;
  name: string;
  imageUrl: string;
  calories: number;
  flavorProfile: FlavorTag[];
  isVegan: boolean;
}

export type FlavorTag = 'spicy' | 'sweet' | 'sour' | 'salty' | 'bitter' | 'umami' | 'mild';

// ===== 장바구니 =====

export interface CartItem {
  menuId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// ===== 주문 =====

export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableNo: number;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistory {
  id: number;
  orderNumber: string;
  tableNo: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  completedAt: string;
}

// ===== 테이블 (관리자용) =====

export interface TableDashboard {
  id: number;
  tableNo: number;
  sessionId: string | null;
  totalAmount: number;
  orders: Order[];
  hasActiveSession: boolean;
}

// ===== SSE 이벤트 =====

export type SSEEventType = 'new-order' | 'status-change' | 'order-deleted' | 'table-completed';

export interface NewOrderEvent {
  order: Order;
}

export interface StatusChangeEvent {
  orderId: number;
  status: OrderStatus;
}

export interface OrderDeletedEvent {
  orderId: number;
  tableId: number;
}

export interface TableCompletedEvent {
  tableId: number;
}

// ===== API =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== API 요청 타입 =====

export interface TableLoginRequest {
  storeId: string;
  tableNo: number;
  password: string;
}

export interface AdminLoginRequest {
  storeId: string;
  username: string;
  password: string;
}

export interface CreateOrderRequest {
  tableId: number;
  sessionId: string;
  items: { menuId: number; quantity: number }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateMenuRequest {
  categoryId: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export interface UpdateMenuRequest extends Partial<CreateMenuRequest> {}

export interface ReorderMenusRequest {
  menuIds: number[];
}

export interface CreateIngredientRequest {
  name: string;
  imageUrl?: string;
  calories: number;
  flavorProfile: FlavorTag[];
  isVegan: boolean;
}

export interface SetupTableRequest {
  storeId: string;
  tableNo: number;
  password: string;
}

export interface UploadResponse {
  filename: string;
  url: string;
}
