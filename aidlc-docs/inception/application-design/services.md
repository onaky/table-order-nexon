# Services Design

## Service Architecture Overview

```
Client (React) → API Routes → Controllers → Services → Models (TypeORM) → MySQL
                                    ↓
                              SSEService → Connected Clients
```

---

## Backend Services

### AuthService
**책임**: 인증 및 권한 관리

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `authenticateTable` | 테이블 인증 (매장+테이블+비밀번호 검증) | Admin, Table Entity |
| `authenticateAdmin` | 관리자 인증 (매장+계정 검증, JWT 발급) | Admin Entity, bcrypt |
| `verifyToken` | JWT 토큰 검증 및 페이로드 추출 | jsonwebtoken |
| `hashPassword` | 비밀번호 bcrypt 해싱 | bcrypt |
| `comparePassword` | 비밀번호 비교 검증 | bcrypt |

**오케스트레이션**: 독립적 서비스, 다른 서비스에서 호출하지 않음. Middleware에서 사용.

---

### MenuService
**책임**: 메뉴 비즈니스 로직

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `findAll` | 매장별 메뉴 조회 (카테고리 필터) | Menu Entity |
| `findById` | 메뉴 상세 조회 (재료 포함) | Menu, MenuIngredient Entity |
| `create` | 메뉴 생성 | Menu Entity, UploadService |
| `update` | 메뉴 수정 | Menu Entity, UploadService |
| `delete` | 메뉴 삭제 (연관 데이터 정리) | Menu, MenuIngredient Entity |
| `reorder` | 메뉴 순서 변경 | Menu Entity |

**오케스트레이션**: UploadService와 협력 (이미지 관리)

---

### IngredientService
**책임**: 재료 비즈니스 로직

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `findAll` | 전체 재료 조회 | Ingredient Entity |
| `findByMenu` | 메뉴별 재료 조회 | MenuIngredient Entity |
| `create` | 재료 생성 | Ingredient Entity, UploadService |
| `update` | 재료 수정 | Ingredient Entity |
| `delete` | 재료 삭제 | Ingredient, MenuIngredient Entity |
| `linkToMenu` | 메뉴에 재료 연결 | MenuIngredient Entity |
| `unlinkFromMenu` | 메뉴에서 재료 해제 | MenuIngredient Entity |

**오케스트레이션**: UploadService와 협력 (재료 이미지)

---

### OrderService
**책임**: 주문 비즈니스 로직 (핵심 서비스)

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `create` | 주문 생성 + SSE 이벤트 발행 | Order, OrderItem Entity, SSEService, TableService |
| `findByTableSession` | 현재 세션 주문 조회 | Order Entity |
| `findByStore` | 매장 전체 주문 조회 (대시보드용) | Order Entity |
| `updateStatus` | 주문 상태 변경 + SSE 이벤트 발행 | Order Entity, SSEService |
| `delete` | 주문 삭제 + SSE 이벤트 발행 | Order, OrderItem Entity, SSEService |
| `getHistory` | 과거 주문 이력 조회 | OrderHistory Entity |

**오케스트레이션**: 
- SSEService 호출 (주문 생성/상태변경/삭제 시 실시간 알림)
- TableService 호출 (세션 확인, 첫 주문 시 세션 시작)

---

### TableService
**책임**: 테이블 및 세션 관리

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `findAll` | 매장별 테이블 조회 | Table Entity |
| `setup` | 테이블 초기 설정 | Table Entity, AuthService |
| `completeSession` | 세션 종료 (주문 → 이력 이동) | TableSession, Order, OrderHistory Entity |
| `getCurrentSession` | 현재 활성 세션 조회 | TableSession Entity |
| `createSession` | 새 세션 생성 | TableSession Entity |

**오케스트레이션**: 
- `completeSession`에서 OrderService의 주문 데이터를 OrderHistory로 이동
- SSEService 호출 (테이블 상태 변경 알림)

---

### SSEService
**책임**: Server-Sent Events 관리

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `addClient` | SSE 클라이언트 연결 등록 | - |
| `removeClient` | SSE 클라이언트 연결 해제 | - |
| `broadcastOrderEvent` | 주문 이벤트 브로드캐스트 | - |
| `broadcastStatusChange` | 상태 변경 이벤트 브로드캐스트 | - |

**오케스트레이션**: 독립적 서비스. OrderService, TableService에서 호출됨.

**구현 패턴**:
- 매장별 클라이언트 목록 관리 (Map<storeId, Response[]>)
- 연결 해제 시 자동 정리 (req.on('close'))
- 이벤트 타입: `new-order`, `status-change`, `order-deleted`, `table-completed`

---

### UploadService
**책임**: 파일 업로드/삭제

| 메서드 | 설명 | 의존성 |
|--------|------|--------|
| `saveImage` | 이미지 파일 저장 (uploads/ 디렉토리) | fs, path |
| `deleteImage` | 이미지 파일 삭제 | fs |
| `getImagePath` | 이미지 접근 경로 반환 | path |

**오케스트레이션**: 독립적 서비스. MenuService, IngredientService에서 호출됨.

---

## Frontend Services (Zustand Stores)

### useAuthStore
```typescript
{
  // State
  token: string | null
  tableInfo: { storeId: string; tableNo: number } | null
  adminInfo: Admin | null
  isAuthenticated: boolean
  
  // Actions
  tableLogin(storeId, tableNo, password): Promise<void>
  adminLogin(storeId, username, password): Promise<void>
  logout(): void
  checkAuth(): Promise<boolean>
}
```

### useCartStore
```typescript
{
  // State
  items: CartItem[]
  
  // Actions (localStorage 동기화)
  addItem(menu: Menu): void
  removeItem(menuId: number): void
  updateQuantity(menuId: number, quantity: number): void
  clearCart(): void
  
  // Computed
  totalAmount: number
  itemCount: number
}
```

### useOrderStore
```typescript
{
  // State
  orders: Order[]
  connected: boolean
  
  // Actions
  connectSSE(storeId: string): void
  disconnectSSE(): void
  
  // SSE로 자동 업데이트
}
```
