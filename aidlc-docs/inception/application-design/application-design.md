# Application Design - 통합 문서

## 1. 아키텍처 개요

### 시스템 구성
```
+------------------+         +------------------+         +--------+
|   Frontend       |  HTTP   |   Backend        |  SQL    | MySQL  |
|   (React + TS)   | ------> |   (Express + TS) | ------> |   DB   |
|                  | <------ |                  | <------ |        |
|   - Customer UI  |   REST  |   - Controllers  |         +--------+
|   - Admin UI     |   SSE   |   - Services     |
+------------------+         |   - Models       |         +--------+
                             |   - Middleware   |         | uploads/|
                             +------------------+         | (files) |
                                                          +--------+
```

### 기술 스택 요약
| 영역 | 기술 |
|------|------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| State Management | Zustand |
| Data Fetching | Axios + TanStack Query (React Query) |
| Routing | React Router v6 (/customer/*, /admin/*) |
| Styling | Tailwind CSS (다크 모드 프리미엄) |
| 3D | React Three Fiber + Drei |
| Animation | Framer Motion |
| Charts | Recharts |
| DnD | dnd-kit |
| Backend | Node.js + Express + TypeScript |
| ORM | TypeORM |
| Database | MySQL |
| Auth | JWT + bcrypt |
| Realtime | Server-Sent Events (SSE) |
| File Upload | Multer (로컬 파일 시스템) |

---

## 2. 프론트엔드 구조

### 라우팅 구조 (단일 앱, 경로 분리)
```
/                          → 리다이렉트 (/customer/menu)
/customer/login            → CustomerLoginPage
/customer/menu             → MenuPage (기본 화면)
/customer/menu/:id         → MenuDetailPage (3D + 재료)
/customer/cart             → CartPage
/customer/order/confirm    → OrderConfirmPage
/customer/order/success    → OrderSuccessPage
/customer/orders           → OrderHistoryPage
/admin/login               → AdminLoginPage
/admin/dashboard           → DashboardPage
/admin/tables              → TableManagementPage
/admin/menus               → MenuManagementPage
/admin/ingredients         → IngredientManagementPage
```

### 상태 관리 전략
- **서버 상태**: TanStack Query (캐싱, 자동 리페치, 낙관적 업데이트)
- **클라이언트 상태**: Zustand (인증, 장바구니)
- **장바구니**: Zustand + localStorage persist
- **실시간 데이터**: SSE + Zustand store

---

## 3. 백엔드 구조

### 레이어 아키텍처
```
Routes → Controllers → Services → Repositories (TypeORM) → MySQL
              ↓
         Middleware (Auth, Upload, Error)
```

### API 설계 원칙
- RESTful 엔드포인트
- JWT Bearer 토큰 인증
- 일관된 응답 형식: `{ success: boolean, data?: T, error?: string }`
- HTTP 상태 코드 준수 (200, 201, 400, 401, 404, 500)

---

## 4. 데이터 모델 (Entity 관계)

```
Store (1) ──── (N) Admin
Store (1) ──── (N) Table
Store (1) ──── (N) Category

Table (1) ──── (N) TableSession
TableSession (1) ──── (N) Order

Category (1) ──── (N) Menu
Menu (N) ──── (M) Ingredient  [via MenuIngredient]

Order (1) ──── (N) OrderItem
OrderItem (N) ──── (1) Menu

Table (1) ──── (N) OrderHistory
```

---

## 5. 실시간 통신 (SSE)

### 이벤트 타입
| Event | Payload | 발생 시점 |
|-------|---------|-----------|
| `new-order` | Order 전체 데이터 | 고객 주문 생성 시 |
| `status-change` | { orderId, status } | 관리자 상태 변경 시 |
| `order-deleted` | { orderId, tableId } | 관리자 주문 삭제 시 |
| `table-completed` | { tableId } | 테이블 이용 완료 시 |

### 연결 관리
- 매장별 클라이언트 그룹 관리
- 연결 해제 시 자동 정리
- 재연결 로직 (프론트엔드 EventSource 자동 재연결)

---

## 6. 차별화 기능 설계

### 3D 메뉴 뷰어
- React Three Fiber + Drei 라이브러리
- GLB/GLTF 모델 또는 이미지 기반 3D 카드 회전
- OrbitControls로 마우스/터치 회전
- 폴백: 3D 미지원 시 정적 이미지

### 재료 정보 UI
- 메뉴 상세 페이지 우측 세로 레이아웃
- 각 재료: 원형 이미지 + 이름 + 칼로리 + 맛 태그
- 비건/알레르기 아이콘 표시

### 주문 경과 시간 UI
- `setInterval` 기반 1초 단위 업데이트
- CSS 변수로 색상 단계 제어
- Framer Motion으로 펄스/글로우 애니메이션

### 매출 차트
- Recharts 바 차트 (테이블별 매출)
- 실시간 데이터 반영 (주문 이벤트 시 업데이트)

### 드래그 앤 드롭
- dnd-kit (접근성 지원, 터치 지원)
- 순서 변경 시 서버 즉시 저장

---

## 참조 문서
- [Components](./components.md)
- [Component Methods](./component-methods.md)
- [Services](./services.md)
- [Component Dependencies](./component-dependency.md)
