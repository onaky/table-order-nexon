# Domain Entities - Frontend TypeScript Types

## Core Types

```typescript
// ===== 매장 & 인증 =====

interface Store {
  id: string;
  name: string;
}

interface Admin {
  id: number;
  storeId: string;
  username: string;
}

interface TableInfo {
  id: number;
  storeId: string;
  tableNo: number;
  sessionId: string | null;
}

interface AuthToken {
  token: string;
  expiresAt: string; // ISO 8601
}

// ===== 카테고리 & 메뉴 =====

interface Category {
  id: number;
  storeId: string;
  name: string;
  sortOrder: number;
}

interface Menu {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

interface MenuDetail extends Menu {
  ingredients: Ingredient[];
}

interface Ingredient {
  id: number;
  name: string;
  imageUrl: string;
  calories: number;
  flavorProfile: FlavorTag[]; // 예: ['spicy', 'sweet']
  isVegan: boolean;
}

type FlavorTag = 'spicy' | 'sweet' | 'sour' | 'salty' | 'bitter' | 'umami' | 'mild';

// ===== 장바구니 =====

interface CartItem {
  menuId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// ===== 주문 =====

type OrderStatus = 'pending' | 'preparing' | 'completed';

interface Order {
  id: number;
  orderNumber: string; // "0506-001" 형식
  tableId: number;
  tableNo: number;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string; // ISO 8601
}

interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderHistory {
  id: number;
  orderNumber: string;
  tableNo: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  completedAt: string;
}

// ===== 테이블 (관리자용) =====

interface TableDashboard {
  id: number;
  tableNo: number;
  sessionId: string | null;
  totalAmount: number;
  orders: Order[];
  hasActiveSession: boolean;
}

// ===== SSE 이벤트 =====

type SSEEventType = 'new-order' | 'status-change' | 'order-deleted' | 'table-completed';

interface SSEEvent {
  type: SSEEventType;
  data: NewOrderEvent | StatusChangeEvent | OrderDeletedEvent | TableCompletedEvent;
}

interface NewOrderEvent {
  order: Order;
}

interface StatusChangeEvent {
  orderId: number;
  status: OrderStatus;
}

interface OrderDeletedEvent {
  orderId: number;
  tableId: number;
}

interface TableCompletedEvent {
  tableId: number;
}

// ===== API 응답 =====

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## API 요청 타입

```typescript
// 인증
interface TableLoginRequest {
  storeId: string;
  tableNo: number;
  password: string;
}

interface AdminLoginRequest {
  storeId: string;
  username: string;
  password: string;
}

// 주문
interface CreateOrderRequest {
  tableId: number;
  sessionId: string;
  items: { menuId: number; quantity: number }[];
}

// 주문 상태 변경
interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// 메뉴 관리
interface CreateMenuRequest {
  categoryId: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface UpdateMenuRequest extends Partial<CreateMenuRequest> {}

interface ReorderMenusRequest {
  menuIds: number[];
}

// 재료 관리
interface CreateIngredientRequest {
  name: string;
  imageUrl?: string;
  calories: number;
  flavorProfile: FlavorTag[];
  isVegan: boolean;
}

// 테이블 관리
interface SetupTableRequest {
  storeId: string;
  tableNo: number;
  password: string;
}

// 이미지 업로드
interface UploadResponse {
  filename: string;
  url: string;
}
```

---

## 목업 데이터 구조

```typescript
// mocks/categories.ts
const mockCategories: Category[] = [
  { id: 1, storeId: 'store-01', name: '메인 메뉴', sortOrder: 1 },
  { id: 2, storeId: 'store-01', name: '사이드', sortOrder: 2 },
  { id: 3, storeId: 'store-01', name: '음료', sortOrder: 3 },
  { id: 4, storeId: 'store-01', name: '디저트', sortOrder: 4 },
];

// mocks/menus.ts
const mockMenus: MenuDetail[] = [
  {
    id: 1, categoryId: 1, name: '시그니처 버거',
    price: 15000, description: '프리미엄 앵거스 비프 패티...',
    imageUrl: '/mock-images/burger.jpg', sortOrder: 1,
    ingredients: [
      { id: 1, name: '앵거스 비프', imageUrl: '/mock-images/beef.jpg', calories: 250, flavorProfile: ['umami', 'salty'], isVegan: false },
      { id: 2, name: '체다 치즈', imageUrl: '/mock-images/cheese.jpg', calories: 110, flavorProfile: ['salty', 'umami'], isVegan: false },
      // ...
    ]
  },
  // ...
];

// mocks/orders.ts
const mockOrders: Order[] = [
  {
    id: 1, orderNumber: '0506-001', tableId: 1, tableNo: 1,
    sessionId: 'session-001', status: 'pending', totalAmount: 30000,
    items: [{ id: 1, menuId: 1, menuName: '시그니처 버거', quantity: 2, unitPrice: 15000 }],
    createdAt: '2026-05-06T09:00:00Z'
  },
  // ...
];
```
