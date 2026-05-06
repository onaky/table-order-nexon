# Code Generation Plan - Frontend UI Unit

## Unit Context
- **Unit Name**: frontend-ui
- **Directory**: `frontend/`
- **Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand + React Query + Framer Motion + React Three Fiber + dnd-kit + Recharts
- **개발 전략**: 목업 데이터 기반 독립 개발 (Backend 없이 동작)

## Stories Covered
US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10, US-11, US-12, US-13, US-14, US-15, US-16, US-17, US-18, US-19, US-20, US-21, US-22

---

## Code Generation Steps

### Step 1: Project Structure Setup
- [x] Vite + React + TypeScript 프로젝트 초기화 (package.json, tsconfig.json, vite.config.ts)
- [x] Tailwind CSS 설정 (tailwind.config.ts, postcss.config.js, 다크 모드 테마)
- [x] 디렉토리 구조 생성 (src/pages, components, hooks, stores, api, types, mocks, assets)
- [x] React Router 설정 (App.tsx 라우팅)
- [x] Axios 인스턴스 설정 (api/client.ts)

### Step 2: TypeScript Types & Mock Data
- [x] 공통 타입 정의 (src/types/index.ts)
- [x] 목업 데이터 생성 (src/mocks/ - categories, menus, ingredients, orders, tables)

### Step 3: Zustand Stores
- [x] authStore.ts (테이블/관리자 인증 상태, localStorage persist)
- [x] cartStore.ts (장바구니 상태, localStorage persist)
- [x] orderStore.ts (SSE 주문 상태)

### Step 4: API Layer (목업 모드 포함)
- [x] api/client.ts (Axios 인스턴스 + 인터셉터)
- [x] api/auth.api.ts
- [x] api/menu.api.ts
- [x] api/category.api.ts
- [x] api/ingredient.api.ts
- [x] api/order.api.ts
- [x] api/table.api.ts
- [x] api/upload.api.ts

### Step 5: Custom Hooks
- [x] hooks/useAuth.ts (React Query + authStore 연동)
- [x] hooks/useMenu.ts (메뉴 조회/뮤테이션)
- [x] hooks/useCategory.ts
- [x] hooks/useIngredient.ts
- [x] hooks/useCart.ts (cartStore 래퍼)
- [x] hooks/useOrder.ts (주문 생성/조회)
- [x] hooks/useSSE.ts (EventSource 관리)
- [x] hooks/useUpload.ts (이미지 업로드)

### Step 6: Common Components
- [x] components/common/Toast.tsx (토스트 알림)
- [x] components/common/ConfirmModal.tsx (확인 팝업)
- [x] components/common/LoadingSpinner.tsx
- [x] components/common/ImageUploader.tsx
- [x] components/common/CartBadge.tsx
- [x] components/layout/Layout.tsx (공통 레이아웃)

### Step 7: Customer Pages - 인증 & 메뉴
- [x] pages/customer/CustomerLoginPage.tsx (US-01)
- [x] pages/customer/MenuPage.tsx (US-03)
- [x] components/menu/CategoryTabs.tsx
- [x] components/menu/MenuCard.tsx

### Step 8: Customer Pages - 메뉴 상세 (3D + 재료)
- [x] pages/customer/MenuDetailPage.tsx (US-04, US-16, US-17)
- [x] components/menu/Menu3DViewer.tsx (이미지 기반 3D 카드)
- [x] components/menu/IngredientList.tsx (재료 목록)

### Step 9: Customer Pages - 장바구니 & 주문
- [x] pages/customer/CartPage.tsx (US-05, US-06)
- [x] pages/customer/OrderConfirmPage.tsx (US-07)
- [x] pages/customer/OrderSuccessPage.tsx (US-07)
- [x] pages/customer/OrderHistoryPage.tsx (US-08, US-19)
- [x] components/order/OrderStatusBadge.tsx (상태 애니메이션)

### Step 10: Admin Pages - 인증 & 대시보드
- [x] pages/admin/AdminLoginPage.tsx (US-02)
- [x] pages/admin/DashboardPage.tsx (US-09, US-10, US-20, US-21)
- [x] components/order/TableCard.tsx (테이블별 주문 카드)
- [x] components/order/OrderTimeIndicator.tsx (경과 시간 UI)
- [x] components/admin/SalesChart.tsx (매출 차트)

### Step 11: Admin Pages - 테이블 & 메뉴 관리
- [x] pages/admin/TableManagementPage.tsx (US-11, US-12, US-13, US-14)
- [x] pages/admin/MenuManagementPage.tsx (US-15, US-22)
- [x] pages/admin/IngredientManagementPage.tsx (US-18)
- [x] components/admin/DragDropMenuList.tsx (드래그앤드롭)

### Step 12: Global Styles & Entry Point
- [x] src/index.css (Tailwind directives + 다크 모드 커스텀 스타일)
- [x] src/main.tsx (앱 진입점, QueryClientProvider, RouterProvider)
- [x] index.html

### Step 13: Documentation
- [x] aidlc-docs/construction/frontend-ui/code/code-summary.md (생성된 코드 요약)
