# Component Dependencies

## Backend Layer Dependencies

```
Routes → Controllers → Services → Models (TypeORM Entities) → MySQL
              ↓              ↓
         Middleware      SSEService → Connected Clients
```

### Dependency Matrix

| Service | 의존하는 Entity | 의존하는 Service |
|---------|----------------|-----------------|
| AuthService | Admin, Table | - |
| MenuService | Menu, MenuIngredient | UploadService |
| CategoryService | Category | - |
| IngredientService | Ingredient, MenuIngredient | UploadService |
| OrderService | Order, OrderItem, OrderHistory | SSEService, TableService |
| TableService | Table, TableSession, Order, OrderHistory | SSEService |
| SSEService | - | - |
| UploadService | - | - |

### Controller → Service 매핑

| Controller | 사용하는 Service |
|-----------|-----------------|
| AuthController | AuthService |
| MenuController | MenuService |
| CategoryController | CategoryService |
| IngredientController | IngredientService |
| OrderController | OrderService |
| TableController | TableService |
| UploadController | UploadService |
| SSEController | SSEService |

### Middleware Dependencies

| Middleware | 사용하는 Service |
|-----------|-----------------|
| authMiddleware | AuthService (verifyToken) |
| tableAuthMiddleware | AuthService (verifyToken) |
| uploadMiddleware | - (Multer 독립) |

---

## Frontend Dependencies

### Page → Hook/Store 매핑

| Page | Hooks/Stores |
|------|-------------|
| CustomerLoginPage | useAuthStore |
| MenuPage | useMenus, useCategories, useCartStore |
| MenuDetailPage | useMenuDetail, useMenuIngredients, useCartStore |
| CartPage | useCartStore |
| OrderConfirmPage | useCartStore, useCreateOrder |
| OrderSuccessPage | - |
| OrderHistoryPage | useOrders |
| AdminLoginPage | useAuthStore |
| DashboardPage | useOrderSSE, useOrderStore |
| TableManagementPage | useTables, useOrders |
| MenuManagementPage | useMenus, useCategories, useMenuMutation, useUpload |
| IngredientManagementPage | useIngredients, useIngredientMutation, useUpload |

### Component → Library 매핑

| Component | 외부 라이브러리 |
|-----------|---------------|
| Menu3DViewer | @react-three/fiber, @react-three/drei |
| SalesChart | recharts |
| DragDropMenuList | @dnd-kit/core, @dnd-kit/sortable |
| OrderStatusBadge | framer-motion |
| OrderTimeIndicator | framer-motion |
| Toast | framer-motion |
| ImageUploader | axios (직접 업로드) |

---

## Frontend ↔ Backend API 통신 매핑

### 고객용 API

| Frontend Action | HTTP Method | Endpoint | 인증 |
|----------------|-------------|----------|------|
| 테이블 로그인 | POST | /api/auth/table/login | None |
| 메뉴 목록 조회 | GET | /api/menus?categoryId= | Table Token |
| 메뉴 상세 조회 | GET | /api/menus/:id | Table Token |
| 메뉴 재료 조회 | GET | /api/menus/:id/ingredients | Table Token |
| 주문 생성 | POST | /api/orders | Table Token |
| 주문 내역 조회 | GET | /api/orders?tableId=&sessionId= | Table Token |

### 관리자용 API

| Frontend Action | HTTP Method | Endpoint | 인증 |
|----------------|-------------|----------|------|
| 관리자 로그인 | POST | /api/auth/admin/login | None |
| SSE 연결 | GET | /api/sse/orders?storeId= | Admin Token |
| 주문 상태 변경 | PUT | /api/orders/:id/status | Admin Token |
| 주문 삭제 | DELETE | /api/orders/:id | Admin Token |
| 테이블 목록 | GET | /api/tables | Admin Token |
| 테이블 설정 | POST | /api/tables/setup | Admin Token |
| 테이블 이용 완료 | POST | /api/tables/:id/complete | Admin Token |
| 과거 내역 조회 | GET | /api/tables/:id/history?date= | Admin Token |
| 메뉴 CRUD | GET/POST/PUT/DELETE | /api/menus/* | Admin Token |
| 메뉴 순서 변경 | PUT | /api/menus/reorder | Admin Token |
| 카테고리 CRUD | GET/POST/PUT/DELETE | /api/categories/* | Admin Token |
| 재료 CRUD | GET/POST/PUT/DELETE | /api/ingredients/* | Admin Token |
| 재료-메뉴 연결 | POST/DELETE | /api/menus/:id/ingredients/:id | Admin Token |
| 이미지 업로드 | POST | /api/uploads/image | Admin Token |

---

## Data Flow Diagrams

### 주문 생성 플로우
```
Customer UI → POST /api/orders → OrderController → OrderService
                                                       ↓
                                                  Save to DB
                                                       ↓
                                                  SSEService.broadcastOrderEvent()
                                                       ↓
                                                  Admin Dashboard (실시간 업데이트)
```

### 주문 상태 변경 플로우
```
Admin UI → PUT /api/orders/:id/status → OrderController → OrderService
                                                              ↓
                                                         Update DB
                                                              ↓
                                                         SSEService.broadcastStatusChange()
                                                              ↓
                                                         Customer UI (상태 업데이트)
                                                         Admin Dashboard (상태 업데이트)
```

### 테이블 이용 완료 플로우
```
Admin UI → POST /api/tables/:id/complete → TableController → TableService
                                                                  ↓
                                                             Orders → OrderHistory
                                                             Session 종료
                                                             테이블 리셋
                                                                  ↓
                                                             SSEService.broadcast()
                                                                  ↓
                                                             Admin Dashboard (테이블 리셋 반영)
```
