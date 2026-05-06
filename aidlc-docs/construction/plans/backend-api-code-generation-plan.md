# Backend API - Code Generation Plan

> **이 문서는 Backend API unit의 코드 생성에 대한 단일 진실 소스(Single Source of Truth)입니다.**

---

## Unit Context

### 기본 정보
| 항목 | 내용 |
|------|------|
| Unit 이름 | backend-api |
| 코드 위치 | `backend/` (workspace root 하위) |
| 기술 스택 | Node.js + Express + TypeScript + TypeORM + MySQL |
| 프로젝트 타입 | Greenfield |

### 담당 Stories (18개)
| Story | 제목 | Priority |
|-------|------|----------|
| US-01 | 테이블 태블릿 자동 로그인 (API) | Must |
| US-02 | 관리자 매장 인증 (API) | Must |
| US-03 | 카테고리별 메뉴 탐색 (API) | Must |
| US-04 | 메뉴 상세 정보 (API) | Must |
| US-05 | 장바구니에 메뉴 추가 (주문 생성 API) | Must |
| US-07 | 주문 생성 (API) | Must |
| US-08 | 주문 내역 조회 (API) | Must |
| US-09 | 실시간 주문 대시보드 (SSE API) | Must |
| US-10 | 주문 상태 변경 (API) | Must |
| US-11 | 테이블 초기 설정 (API) | Must |
| US-12 | 주문 삭제 (API) | Must |
| US-13 | 테이블 이용 완료 (API) | Must |
| US-14 | 과거 주문 내역 조회 (API) | Should |
| US-15 | 메뉴 CRUD (API) | Must |
| US-17 | 재료 정보 (API) | Should |
| US-18 | 재료 관리 (API) | Should |
| US-20 | 주문 경과 시간 (주문 생성 시각 포함 API) | Must |
| US-22 | 메뉴 순서 드래그 앤 드롭 (순서 변경 API) | Should |

### Dependencies
- 외부 의존: 없음 (독립 개발 가능)
- DB: MySQL (로컬 개발 환경)
- FE 연동: Unit 3(Integration)에서 진행

---

## Code Generation Steps

### Step 1: Project Structure Setup ✅
- [x] `backend/` 디렉토리 생성
- [x] `package.json` 생성 (dependencies, scripts 정의)
- [x] `tsconfig.json` 생성
- [x] `.env.example` 생성 (환경변수 템플릿)
- [x] `backend/src/` 하위 디렉토리 구조 생성

**생성 파일:**
```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    ├── entities/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── middleware/
    ├── types/
    └── utils/
```

---

### Step 2: Configuration & Utilities ✅
- [x] `src/config/database.ts` — TypeORM DataSource 설정
- [x] `src/config/index.ts` — 환경변수 로드 및 설정 객체
- [x] `src/types/index.ts` — 공통 타입/인터페이스 정의 (DTO, Enum, Request 확장)
- [x] `src/utils/response.ts` — 표준 응답 헬퍼 (successResponse, errorResponse)

**Stories**: 전체 (공통 인프라)

---

### Step 3: Entity Layer (TypeORM Entities) ✅
- [x] `src/entities/Store.ts`
- [x] `src/entities/Admin.ts`
- [x] `src/entities/Table.ts`
- [x] `src/entities/TableSession.ts`
- [x] `src/entities/Category.ts`
- [x] `src/entities/Menu.ts`
- [x] `src/entities/Ingredient.ts`
- [x] `src/entities/MenuIngredient.ts`
- [x] `src/entities/Order.ts`
- [x] `src/entities/OrderItem.ts`
- [x] `src/entities/OrderHistory.ts`
- [x] `src/entities/index.ts` — 전체 Entity export

**Stories**: 전체 (데이터 모델 기반)
**참조**: `domain-entities.md`

---

### Step 4: Middleware Layer ✅
- [x] `src/middleware/auth.middleware.ts` — JWT 검증 (Admin 전용)
- [x] `src/middleware/table-auth.middleware.ts` — JWT 검증 (Table 전용)
- [x] `src/middleware/error-handler.middleware.ts` — 전역 에러 핸들러
- [x] `src/middleware/upload.middleware.ts` — Multer 파일 업로드 설정

**Stories**: US-01, US-02 (인증), 전체 (에러 핸들링)
**참조**: `business-rules.md` BR-A04, BR-R02, BR-R03

---

### Step 5: Service Layer — Auth ✅
- [x] `src/services/auth.service.ts`
  - authenticateTable()
  - authenticateAdmin()
  - verifyToken()
  - hashPassword()
  - comparePassword()

**Stories**: US-01, US-02
**참조**: `business-logic-model.md` §1, `business-rules.md` BR-A01~BR-A05

---

### Step 6: Service Layer — Menu & Category & Ingredient ✅
- [x] `src/services/category.service.ts`
  - findAll(), create(), update(), delete()
- [x] `src/services/menu.service.ts`
  - findAll(), findById(), create(), update(), delete(), reorder()
- [x] `src/services/ingredient.service.ts`
  - findAll(), findByMenu(), create(), update(), delete(), linkToMenu(), unlinkFromMenu()

**Stories**: US-03, US-04, US-15, US-17, US-18, US-22
**참조**: `business-logic-model.md` §6~7, `business-rules.md` BR-M01~BR-M04, BR-I01~BR-I03

---

### Step 7: Service Layer — Order ✅
- [x] `src/services/order.service.ts`
  - create()
  - findByTableSession()
  - findByStore()
  - updateStatus()
  - delete()
  - getHistory()

**Stories**: US-05, US-07, US-08, US-10, US-12, US-14, US-20
**참조**: `business-logic-model.md` §2~4, §10, `business-rules.md` BR-O01~BR-O06

---

### Step 8: Service Layer — Table & Session ✅
- [x] `src/services/table.service.ts`
  - findAll(), setup(), completeSession(), getCurrentSession(), createSession()

**Stories**: US-11, US-13
**참조**: `business-logic-model.md` §5, `business-rules.md` BR-T01~BR-T04

---

### Step 9: Service Layer — SSE & Upload ✅
- [x] `src/services/sse.service.ts`
  - addClient(), removeClient(), broadcastOrderEvent(), broadcastStatusChange()
- [x] `src/services/upload.service.ts`
  - saveImage(), deleteImage(), getImagePath()

**Stories**: US-09 (SSE), US-15, US-18 (Upload)
**참조**: `business-logic-model.md` §8~9, `business-rules.md` BR-U01~BR-U02

---

### Step 10: Controller Layer ✅
- [x] `src/controllers/auth.controller.ts`
- [x] `src/controllers/category.controller.ts`
- [x] `src/controllers/menu.controller.ts`
- [x] `src/controllers/ingredient.controller.ts`
- [x] `src/controllers/order.controller.ts`
- [x] `src/controllers/table.controller.ts`
- [x] `src/controllers/upload.controller.ts`
- [x] `src/controllers/sse.controller.ts`

**Stories**: 전체 (API 엔드포인트 연결)
**참조**: `component-methods.md` Backend Controller Methods

---

### Step 11: Route Layer ✅
- [x] `src/routes/index.ts` — 라우트 통합
- [x] `src/routes/auth.routes.ts`
- [x] `src/routes/category.routes.ts`
- [x] `src/routes/menu.routes.ts`
- [x] `src/routes/ingredient.routes.ts`
- [x] `src/routes/order.routes.ts`
- [x] `src/routes/table.routes.ts`
- [x] `src/routes/upload.routes.ts`
- [x] `src/routes/sse.routes.ts`

**Stories**: 전체
**참조**: `component-dependency.md` FE ↔ BE API 통신 매핑

---

### Step 12: App & Server Entry Point ✅
- [x] `src/app.ts` — Express 앱 설정 (CORS, JSON parser, 정적 파일, 라우트 등록, 에러 핸들러)
- [x] `src/server.ts` — 서버 시작 (DB 연결 → 서버 listen)

**Stories**: 전체 (앱 부트스트랩)

---

### Step 13: Database Seed Script ✅
- [x] `src/scripts/seed.ts` — 초기 데이터 시드 (테스트용 Store, Admin, Category, Menu, Table 생성)

**Stories**: 전체 (개발/테스트 편의)

---

### Step 14: Documentation ✅
- [x] `backend/README.md` — 설치, 실행, API 개요, 환경변수 설명
- [x] `aidlc-docs/construction/backend-api/code/code-summary.md` — 생성된 코드 요약

**Stories**: 전체

---

### Step 15: Deployment Artifacts ✅
- [x] `backend/Dockerfile` (선택 — 로컬 개발용)
- [x] `docker-compose.yml` (루트 — MySQL + Backend 구성)

**Stories**: 전체 (개발 환경 구성)

---

## Step Execution Order & Rationale

```
Step 1  → 프로젝트 뼈대 (다른 모든 Step의 전제)
Step 2  → 설정/유틸 (모든 레이어에서 사용)
Step 3  → Entity (Service가 의존)
Step 4  → Middleware (Controller/Route에서 사용)
Step 5  → Auth Service (다른 Service보다 먼저, Middleware에서 사용)
Step 6  → Menu/Category/Ingredient Service (독립적)
Step 7  → Order Service (SSE, Table Service 의존)
Step 8  → Table Service (Order와 상호 참조)
Step 9  → SSE/Upload Service (다른 Service에서 호출)
Step 10 → Controller (Service 완성 후)
Step 11 → Route (Controller 완성 후)
Step 12 → App/Server (모든 레이어 통합)
Step 13 → Seed (DB 스키마 완성 후)
Step 14 → Documentation
Step 15 → Deployment
```

---

## 총 생성 파일 수 (예상)

| 카테고리 | 파일 수 |
|----------|---------|
| Config/Setup | 6 |
| Entities | 12 |
| Middleware | 4 |
| Services | 8 |
| Controllers | 8 |
| Routes | 9 |
| Entry Points | 2 |
| Scripts | 1 |
| Documentation | 2 |
| Deployment | 2 |
| **합계** | **~54개** |

---

## Story Traceability

모든 18개 Story가 Step 3~12에서 구현됩니다:
- Must Stories (13개): Step 3~12에서 모두 커버
- Should Stories (5개): Step 6~7에서 커버 (재료, 과거 내역, 메뉴 순서)
