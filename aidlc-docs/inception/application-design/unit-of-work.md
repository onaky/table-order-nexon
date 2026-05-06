# Unit of Work Definitions

## 분해 전략
- **방식**: 레이어 기반 (Backend / Frontend)
- **개발 전략**: 병행 개발 (FE는 목업 데이터, BE는 실제 API) → 최종 연동
- **구조**: 모노레포 (`backend/`, `frontend/`)

---

## Unit 1: Backend API

### 개요
| 항목 | 내용 |
|------|------|
| **이름** | backend-api |
| **디렉토리** | `backend/` |
| **기술 스택** | Node.js + Express + TypeScript + TypeORM + MySQL |
| **책임** | REST API, 인증, 비즈니스 로직, 데이터 관리, SSE, 파일 업로드 |

### 포함 컴포넌트
- **Models**: Store, Admin, Table, TableSession, Category, Menu, Ingredient, MenuIngredient, Order, OrderItem, OrderHistory
- **Services**: AuthService, MenuService, CategoryService, IngredientService, OrderService, TableService, SSEService, UploadService
- **Controllers**: AuthController, MenuController, CategoryController, IngredientController, OrderController, TableController, UploadController, SSEController
- **Middleware**: authMiddleware, tableAuthMiddleware, errorHandler, cors, uploadMiddleware
- **Routes**: 8개 라우트 모듈

### 완료 기준
- [ ] TypeORM Entity 전체 정의 및 마이그레이션
- [ ] 모든 REST API 엔드포인트 구현
- [ ] JWT 인증 (관리자 + 테이블) 동작
- [ ] SSE 실시간 이벤트 브로드캐스트 동작
- [ ] 파일 업로드/서빙 동작
- [ ] API 단독 테스트 가능 (Postman/curl)

### 코드 구조
```
backend/
├── src/
│   ├── app.ts                 # Express 앱 설정
│   ├── server.ts              # 서버 시작점
│   ├── config/
│   │   └── database.ts        # TypeORM 설정
│   ├── entities/              # TypeORM Entities
│   │   ├── Store.ts
│   │   ├── Admin.ts
│   │   ├── Table.ts
│   │   ├── TableSession.ts
│   │   ├── Category.ts
│   │   ├── Menu.ts
│   │   ├── Ingredient.ts
│   │   ├── MenuIngredient.ts
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   └── OrderHistory.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── menu.routes.ts
│   │   ├── category.routes.ts
│   │   ├── ingredient.routes.ts
│   │   ├── order.routes.ts
│   │   ├── table.routes.ts
│   │   ├── upload.routes.ts
│   │   └── sse.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── menu.controller.ts
│   │   ├── category.controller.ts
│   │   ├── ingredient.controller.ts
│   │   ├── order.controller.ts
│   │   ├── table.controller.ts
│   │   ├── upload.controller.ts
│   │   └── sse.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── menu.service.ts
│   │   ├── category.service.ts
│   │   ├── ingredient.service.ts
│   │   ├── order.service.ts
│   │   ├── table.service.ts
│   │   ├── sse.service.ts
│   │   └── upload.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── table-auth.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   └── upload.middleware.ts
│   ├── types/
│   │   └── index.ts           # 공통 타입 정의
│   └── utils/
│       └── response.ts        # 응답 헬퍼
├── uploads/                   # 업로드된 이미지 저장
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Unit 2: Frontend UI

### 개요
| 항목 | 내용 |
|------|------|
| **이름** | frontend-ui |
| **디렉토리** | `frontend/` |
| **기술 스택** | React + TypeScript + Vite + Tailwind CSS + Zustand + React Query |
| **책임** | 고객 UI, 관리자 UI, 상태 관리, API 연동, 3D 렌더링, 애니메이션 |

### 포함 컴포넌트
- **Pages**: CustomerLoginPage, MenuPage, MenuDetailPage, CartPage, OrderConfirmPage, OrderSuccessPage, OrderHistoryPage, AdminLoginPage, DashboardPage, TableManagementPage, MenuManagementPage, IngredientManagementPage
- **Shared Components**: Layout, CategoryTabs, MenuCard, Menu3DViewer, IngredientList, CartBadge, OrderStatusBadge, OrderTimeIndicator, TableCard, SalesChart, DragDropMenuList, ConfirmModal, Toast, LoadingSpinner, ImageUploader
- **Hooks**: useAuth, useMenu, useCategory, useIngredient, useCart, useOrder, useSSE, useUpload
- **Stores**: useAuthStore, useCartStore, useOrderStore

### 완료 기준
- [ ] 모든 페이지 UI 구현 (다크 모드 프리미엄 테마)
- [ ] 3D 메뉴 뷰어 동작
- [ ] 재료 정보 UI 표시
- [ ] 장바구니 로컬 저장 동작
- [ ] 주문 상태 애니메이션 동작
- [ ] 경과 시간 색상 단계 UI 동작
- [ ] 매출 차트 표시
- [ ] 드래그 앤 드롭 메뉴 순서 변경 동작
- [ ] 목업 데이터로 전체 플로우 테스트 가능

### 코드 구조
```
frontend/
├── src/
│   ├── main.tsx               # 앱 진입점
│   ├── App.tsx                # 라우터 설정
│   ├── api/                   # API 호출 계층
│   │   ├── client.ts          # Axios 인스턴스
│   │   ├── auth.api.ts
│   │   ├── menu.api.ts
│   │   ├── category.api.ts
│   │   ├── ingredient.api.ts
│   │   ├── order.api.ts
│   │   ├── table.api.ts
│   │   └── upload.api.ts
│   ├── components/            # 공통 컴포넌트
│   │   ├── layout/
│   │   │   └── Layout.tsx
│   │   ├── menu/
│   │   │   ├── MenuCard.tsx
│   │   │   ├── Menu3DViewer.tsx
│   │   │   ├── IngredientList.tsx
│   │   │   └── CategoryTabs.tsx
│   │   ├── order/
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderTimeIndicator.tsx
│   │   │   └── TableCard.tsx
│   │   ├── admin/
│   │   │   ├── SalesChart.tsx
│   │   │   └── DragDropMenuList.tsx
│   │   └── common/
│   │       ├── CartBadge.tsx
│   │       ├── ConfirmModal.tsx
│   │       ├── Toast.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ImageUploader.tsx
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── CustomerLoginPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── MenuDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── OrderConfirmPage.tsx
│   │   │   ├── OrderSuccessPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── TableManagementPage.tsx
│   │       ├── MenuManagementPage.tsx
│   │       └── IngredientManagementPage.tsx
│   ├── hooks/                 # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useMenu.ts
│   │   ├── useCategory.ts
│   │   ├── useIngredient.ts
│   │   ├── useCart.ts
│   │   ├── useOrder.ts
│   │   ├── useSSE.ts
│   │   └── useUpload.ts
│   ├── stores/                # Zustand 스토어
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── orderStore.ts
│   ├── types/                 # TypeScript 타입
│   │   └── index.ts
│   ├── mocks/                 # 목업 데이터 (개발용)
│   │   ├── menus.ts
│   │   ├── categories.ts
│   │   ├── ingredients.ts
│   │   ├── orders.ts
│   │   └── tables.ts
│   └── assets/                # 정적 리소스
│       └── ...
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── postcss.config.js
```

---

## Unit 3: Integration (연동)

### 개요
| 항목 | 내용 |
|------|------|
| **이름** | integration |
| **디렉토리** | 루트 (frontend/ + backend/ 연결) |
| **책임** | FE ↔ BE 연동, 목업 제거, E2E 플로우 검증 |

### 완료 기준
- [ ] Frontend API 클라이언트를 실제 Backend로 연결
- [ ] 목업 데이터 제거 또는 폴백으로 전환
- [ ] 전체 주문 플로우 E2E 동작 확인
- [ ] SSE 실시간 업데이트 FE ↔ BE 연동 확인
- [ ] 파일 업로드 FE → BE 연동 확인
