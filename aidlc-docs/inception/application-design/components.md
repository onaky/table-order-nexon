# Components

## Frontend Components

### Pages (고객용 - /customer/*)

| Component | 책임 |
|-----------|------|
| `CustomerLoginPage` | 테이블 초기 설정 (매장ID, 테이블번호, 비밀번호 입력) |
| `MenuPage` | 카테고리별 메뉴 목록 표시, 기본 화면 |
| `MenuDetailPage` | 메뉴 상세 (3D 뷰, 재료 정보, 블랙 배경) |
| `CartPage` | 장바구니 관리 (수량 조절, 삭제, 총액) |
| `OrderConfirmPage` | 주문 최종 확인 및 확정 |
| `OrderSuccessPage` | 주문 성공 표시 (5초 후 리다이렉트) |
| `OrderHistoryPage` | 현재 세션 주문 내역 조회 |

### Pages (관리자용 - /admin/*)

| Component | 책임 |
|-----------|------|
| `AdminLoginPage` | 관리자 로그인 (매장ID, 사용자명, 비밀번호) |
| `DashboardPage` | 실시간 주문 모니터링 대시보드 |
| `TableManagementPage` | 테이블 관리 (설정, 세션 종료, 과거 내역) |
| `MenuManagementPage` | 메뉴 CRUD + 드래그앤드롭 순서 관리 |
| `IngredientManagementPage` | 재료 관리 (CRUD, 메뉴 연결) |

### Shared Components

| Component | 책임 |
|-----------|------|
| `Layout` | 공통 레이아웃 (네비게이션, 컨테이너) |
| `CategoryTabs` | 카테고리 탭 네비게이션 |
| `MenuCard` | 메뉴 카드 (이미지, 이름, 가격) |
| `Menu3DViewer` | Three.js 기반 3D 메뉴 렌더러 |
| `IngredientList` | 재료 목록 (이미지, 칼로리, 맛 프로필) |
| `CartBadge` | 장바구니 아이콘 + 수량 뱃지 |
| `OrderStatusBadge` | 주문 상태 표시 (색상 + 애니메이션) |
| `OrderTimeIndicator` | 주문 경과 시간 표시 (색상 단계) |
| `TableCard` | 테이블별 주문 카드 (대시보드용) |
| `SalesChart` | 매출 차트 컴포넌트 |
| `DragDropMenuList` | 드래그앤드롭 메뉴 순서 관리 |
| `ConfirmModal` | 확인 팝업 모달 |
| `Toast` | 토스트 알림 |
| `LoadingSpinner` | 로딩 표시 |
| `ImageUploader` | 이미지 파일 업로드 컴포넌트 |

---

## Backend Components

### Routes (API Endpoints)

| Route Module | 경로 | 책임 |
|-------------|------|------|
| `authRoutes` | `/api/auth/*` | 인증 관련 (로그인, 토큰 검증) |
| `menuRoutes` | `/api/menus/*` | 메뉴 CRUD, 순서 변경 |
| `categoryRoutes` | `/api/categories/*` | 카테고리 CRUD |
| `ingredientRoutes` | `/api/ingredients/*` | 재료 CRUD, 메뉴 연결 |
| `orderRoutes` | `/api/orders/*` | 주문 생성, 조회, 상태 변경, 삭제 |
| `tableRoutes` | `/api/tables/*` | 테이블 관리, 세션 관리 |
| `uploadRoutes` | `/api/uploads/*` | 파일 업로드 |
| `sseRoutes` | `/api/sse/*` | SSE 스트림 연결 |

### Controllers

| Controller | 책임 |
|-----------|------|
| `AuthController` | 인증 요청 처리 (로그인, 토큰 갱신) |
| `MenuController` | 메뉴 CRUD 요청 처리 |
| `CategoryController` | 카테고리 CRUD 요청 처리 |
| `IngredientController` | 재료 CRUD 및 메뉴 연결 처리 |
| `OrderController` | 주문 생성/조회/상태변경/삭제 처리 |
| `TableController` | 테이블 설정/세션 관리 처리 |
| `UploadController` | 파일 업로드 처리 |
| `SSEController` | SSE 연결 관리 및 이벤트 전송 |

### Services

| Service | 책임 |
|---------|------|
| `AuthService` | 인증 로직 (비밀번호 검증, JWT 생성/검증) |
| `MenuService` | 메뉴 비즈니스 로직 |
| `CategoryService` | 카테고리 비즈니스 로직 |
| `IngredientService` | 재료 비즈니스 로직 |
| `OrderService` | 주문 비즈니스 로직 (생성, 상태 변경, 삭제) |
| `TableService` | 테이블/세션 비즈니스 로직 |
| `UploadService` | 파일 저장/삭제 로직 |
| `SSEService` | SSE 클라이언트 관리, 이벤트 브로드캐스트 |

### Models (TypeORM Entities)

| Entity | 책임 |
|--------|------|
| `Store` | 매장 정보 |
| `Admin` | 관리자 계정 |
| `Table` | 테이블 정보 |
| `TableSession` | 테이블 세션 (시작/종료) |
| `Category` | 메뉴 카테고리 |
| `Menu` | 메뉴 항목 |
| `Ingredient` | 재료 정보 |
| `MenuIngredient` | 메뉴-재료 연결 (다대다) |
| `Order` | 주문 |
| `OrderItem` | 주문 항목 |
| `OrderHistory` | 과거 주문 이력 |

### Middleware

| Middleware | 책임 |
|-----------|------|
| `authMiddleware` | JWT 토큰 검증, 관리자 인증 |
| `tableAuthMiddleware` | 테이블 인증 (매장+테이블+비밀번호) |
| `errorHandler` | 전역 에러 핸들링 |
| `cors` | CORS 설정 |
| `uploadMiddleware` | Multer 파일 업로드 처리 |
