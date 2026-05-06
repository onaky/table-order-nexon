# Table Order Nexon - Backend API

테이블오더 서비스의 REST API 서버입니다.

## 기술 스택

- **Runtime**: Node.js 18+
- **Framework**: Express + TypeScript
- **ORM**: TypeORM
- **Database**: MySQL 8.0
- **Auth**: JWT (jsonwebtoken + bcrypt)
- **Realtime**: Server-Sent Events (SSE)
- **File Upload**: Multer

## 시작하기

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 DB 접속 정보 등 수정
```

### 3. MySQL 데이터베이스 생성

```sql
CREATE DATABASE table_order_nexon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 시드 데이터 삽입 (선택)

```bash
npm run seed
```

시드 데이터:
- 매장: STORE01 (넥슨 카페)
- 관리자: admin / admin123
- 테이블: 1~5번 (비밀번호: 1234)
- 카테고리 4개, 메뉴 10개, 재료 8개

### 5. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 인증 (Auth)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /api/auth/table/login | - | 테이블 로그인 |
| POST | /api/auth/admin/login | - | 관리자 로그인 |
| POST | /api/auth/verify | - | 토큰 검증 |

### 카테고리 (Categories)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/categories | Table/Admin | 카테고리 목록 |
| POST | /api/categories | Admin | 카테고리 생성 |
| PUT | /api/categories/:id | Admin | 카테고리 수정 |
| DELETE | /api/categories/:id | Admin | 카테고리 삭제 |

### 메뉴 (Menus)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/menus?categoryId= | Table/Admin | 메뉴 목록 |
| GET | /api/menus/:id | Table/Admin | 메뉴 상세 |
| GET | /api/menus/:id/ingredients | Table/Admin | 메뉴 재료 |
| POST | /api/menus | Admin | 메뉴 생성 |
| PUT | /api/menus/:id | Admin | 메뉴 수정 |
| PUT | /api/menus/reorder | Admin | 메뉴 순서 변경 |
| DELETE | /api/menus/:id | Admin | 메뉴 삭제 |

### 재료 (Ingredients)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/ingredients | Admin | 재료 목록 |
| POST | /api/ingredients | Admin | 재료 생성 |
| PUT | /api/ingredients/:id | Admin | 재료 수정 |
| DELETE | /api/ingredients/:id | Admin | 재료 삭제 |
| POST | /api/menus/:menuId/ingredients/:ingredientId | Admin | 재료 연결 |
| DELETE | /api/menus/:menuId/ingredients/:ingredientId | Admin | 재료 해제 |

### 주문 (Orders)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /api/orders | Table | 주문 생성 |
| GET | /api/orders | Table/Admin | 주문 조회 |
| PUT | /api/orders/:id/status | Admin | 상태 변경 |
| DELETE | /api/orders/:id | Admin | 주문 삭제 |

### 테이블 (Tables)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/tables | Admin | 테이블 목록 |
| POST | /api/tables/setup | Admin | 테이블 설정 |
| POST | /api/tables/:id/complete | Admin | 이용 완료 |
| GET | /api/tables/:id/session | Admin | 세션 조회 |
| GET | /api/tables/:tableId/history?date= | Admin | 과거 내역 |

### 파일 업로드 (Uploads)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /api/uploads/image | Admin | 이미지 업로드 |
| DELETE | /api/uploads/:filename | Admin | 이미지 삭제 |

### SSE (Server-Sent Events)
| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/sse/orders | Admin | 실시간 주문 스트림 |

## API 응답 형식

```json
// 성공
{ "success": true, "data": { ... } }

// 에러
{ "success": false, "error": "에러 메시지" }
```

## SSE 이벤트

| 이벤트 | 발생 시점 |
|--------|-----------|
| connected | SSE 연결 성공 |
| new-order | 새 주문 생성 |
| status-change | 주문 상태 변경 |
| order-deleted | 주문 삭제 |
| table-completed | 테이블 이용 완료 |

## 스크립트

```bash
npm run dev      # 개발 서버 (hot reload)
npm run build    # TypeScript 빌드
npm run start    # 프로덕션 서버
npm run seed     # 시드 데이터 삽입
```
