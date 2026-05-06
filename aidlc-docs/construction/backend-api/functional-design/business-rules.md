# Business Rules - Backend API

## 1. 주문 관련 규칙

### BR-O01: 주문 상태 전이
| 현재 상태 | 허용 전이 | 불허 전이 |
|-----------|-----------|-----------|
| pending | preparing | completed, pending |
| preparing | completed | pending, preparing |
| completed | (없음 - 최종 상태) | pending, preparing |

- 역방향 전이 불가
- 단계 건너뛰기 불가 (pending → completed 불가)
- 동일 상태로 변경 불가

### BR-O02: 주문 생성 조건
- 활성 세션이 존재해야 함
- 최소 1개 이상의 주문 항목 필요
- 모든 메뉴가 해당 매장에 존재하고 판매 가능(isAvailable=true) 상태여야 함
- 수량은 1 이상의 정수

### BR-O03: 주문 삭제 조건
- 관리자만 삭제 가능
- 모든 상태의 주문 삭제 가능 (pending, preparing, completed)
- 삭제 시 해당 주문의 OrderItem도 함께 삭제 (CASCADE)

### BR-O04: 주문 금액 계산
- `OrderItem.subtotal = quantity × unitPrice`
- `Order.totalAmount = SUM(OrderItem.subtotal)`
- 가격은 주문 시점 스냅샷 (이후 메뉴 가격 변경 영향 없음)
- 금액 단위: 원 (정수, 소수점 없음)

### BR-O05: 주문 번호 생성
- 형식: `{storeId}-{MMDD}-{sequence}`
- sequence: 해당 매장의 당일 주문 순번 (001부터 시작, 3자리 zero-pad)
- 날짜 기준: 서버 시간 (KST)
- 유니크 보장: DB UNIQUE 제약 + 동시성 처리 (SELECT FOR UPDATE 또는 재시도)

### BR-O06: 주문 경과 시간
- 경과 시간 = 현재 시각 - Order.createdAt
- 서버는 createdAt만 제공, 경과 시간 계산은 클라이언트 책임
- 색상 단계 기준 (FE 참고용):
  - 0~5분: 정상 (green)
  - 5~10분: 주의 (yellow/orange)
  - 10분+: 경고 (red)

---

## 2. 인증 관련 규칙

### BR-A01: JWT 토큰 구조
| 토큰 타입 | Payload | 만료 시간 |
|-----------|---------|-----------|
| Table Token | `{ type: 'table', storeId, tableId, tableNo, sessionId }` | 24시간 |
| Admin Token | `{ type: 'admin', storeId, adminId, username }` | 16시간 |

### BR-A02: 로그인 시도 제한 (관리자)
- 연속 실패 허용: 5회
- 5회 실패 시: 계정 잠금 15분
- 잠금 해제: lockedUntil 시각 경과 후 자동 해제
- 로그인 성공 시: failedLoginAttempts = 0, lockedUntil = null

### BR-A03: 비밀번호 규칙
- 저장: bcrypt 해시 (salt rounds: 10)
- 최소 길이: 4자 (테이블 비밀번호는 간단한 PIN 허용)
- 관리자 비밀번호: 최소 6자

### BR-A04: 인증 미들웨어 적용 규칙
| 엔드포인트 | 인증 | 미들웨어 |
|-----------|------|----------|
| POST /api/auth/table/login | 없음 | - |
| POST /api/auth/admin/login | 없음 | - |
| GET /api/menus, GET /api/menus/:id | Table 또는 Admin | authMiddleware (both) |
| GET /api/menus/:id/ingredients | Table 또는 Admin | authMiddleware (both) |
| POST/PUT/DELETE /api/menus/* | Admin Only | authMiddleware (admin) |
| GET /api/orders (고객) | Table | tableAuthMiddleware |
| POST /api/orders | Table | tableAuthMiddleware |
| PUT /api/orders/:id/status | Admin | authMiddleware (admin) |
| DELETE /api/orders/:id | Admin | authMiddleware (admin) |
| GET/POST /api/tables/* | Admin | authMiddleware (admin) |
| GET /api/sse/orders | Admin | authMiddleware (admin) |
| POST /api/uploads/* | Admin | authMiddleware (admin) |
| GET /api/categories | Table 또는 Admin | authMiddleware (both) |
| POST/PUT/DELETE /api/categories/* | Admin | authMiddleware (admin) |

### BR-A05: 토큰 검증 실패 처리
- 토큰 없음: 401 Unauthorized
- 토큰 만료: 401 Unauthorized (message: "토큰이 만료되었습니다")
- 토큰 변조: 401 Unauthorized (message: "유효하지 않은 토큰입니다")
- 권한 부족 (table이 admin 전용 접근): 403 Forbidden

---

## 3. 메뉴 관련 규칙

### BR-M01: 메뉴 필수 필드
| 필드 | 필수 | 검증 규칙 |
|------|------|-----------|
| name | ✅ | 1~100자, 공백만 불가 |
| price | ✅ | 0 이상 정수, 최대 1,000,000 |
| categoryId | ✅ | 존재하는 카테고리 ID |
| description | ❌ | 최대 500자 |
| imageUrl | ❌ | 유효한 경로 형식 |

### BR-M02: 메뉴 삭제 규칙
- 메뉴 삭제 시 연결된 MenuIngredient 자동 삭제 (CASCADE)
- 메뉴 삭제 시 이미지 파일도 삭제 (UploadService.deleteImage)
- 기존 주문의 OrderItem은 영향 없음 (menuName, unitPrice 스냅샷 보존)

### BR-M03: 메뉴 순서 규칙
- sortOrder는 카테고리 내에서 유니크
- 새 메뉴 생성 시: 해당 카테고리의 MAX(sortOrder) + 1
- reorder 시: 전달받은 배열 순서대로 0, 1, 2, ... 재할당
- 고객 화면에서는 sortOrder ASC로 표시

### BR-M04: 카테고리 삭제 규칙
- 해당 카테고리에 메뉴가 존재하면 삭제 불가 (RESTRICT)
- 에러: 400 "해당 카테고리에 메뉴가 존재합니다. 메뉴를 먼저 이동하거나 삭제해주세요"

---

## 4. 테이블/세션 관련 규칙

### BR-T01: 세션 시작 조건
- 고객이 테이블 태블릿에 로그인(인증 성공)할 때 세션 시작
- 이미 활성 세션이 있으면 기존 세션 재사용 (중복 생성 방지)
- 세션 ID: UUID v4 형식

### BR-T02: 세션 종료 조건 (이용 완료)
- 관리자만 세션 종료 가능
- 활성 세션이 있어야 종료 가능
- 종료 시 처리:
  1. 현재 세션의 모든 주문 → OrderHistory로 이동
  2. Order + OrderItem 삭제
  3. TableSession.endedAt = now, isActive = false
- 종료 후 고객이 다시 로그인하면 새 세션 자동 생성

### BR-T03: 테이블 설정 규칙
- 동일 매장 내 테이블 번호 중복 불가
- 비밀번호 필수 (최소 4자)
- 설정 시 기존 테이블이 있으면 비밀번호 업데이트
- 설정 시 기존 테이블이 없으면 새 테이블 생성

### BR-T04: 테이블당 활성 세션 제한
- 테이블당 활성 세션(isActive=true)은 최대 1개
- 새 세션 생성 전 기존 활성 세션 확인 필수

---

## 5. 재료 관련 규칙

### BR-I01: 재료 필수 필드
| 필드 | 필수 | 검증 규칙 |
|------|------|-----------|
| name | ✅ | 1~100자 |
| imageUrl | ❌ | 유효한 경로 형식 |
| calories | ❌ | 0 이상 정수 |
| flavor | ❌ | enum: 매운맛, 단맛, 짠맛, 신맛, 감칠맛, 쓴맛 |
| isVegan | ❌ | boolean, 기본값 false |
| allergyInfo | ❌ | 최대 200자 |

### BR-I02: 재료 삭제 규칙
- 재료 삭제 시 연결된 MenuIngredient 자동 삭제 (CASCADE)
- 재료 이미지 파일도 삭제

### BR-I03: 메뉴-재료 연결 규칙
- 동일 메뉴에 동일 재료 중복 연결 불가 (UNIQUE 제약)
- 연결 시 sortOrder 자동 할당 (마지막 + 1)
- 메뉴와 재료는 동일 매장(storeId)에 속해야 함

---

## 6. 파일 업로드 규칙

### BR-U01: 업로드 제한
| 항목 | 제한 |
|------|------|
| 최대 파일 크기 | 5MB |
| 허용 MIME 타입 | image/jpeg, image/png, image/gif, image/webp |
| 저장 위치 | backend/uploads/ |
| 파일명 형식 | {timestamp}-{random8}.{ext} |
| 접근 URL | /uploads/{filename} (정적 파일 서빙) |

### BR-U02: 이미지 삭제 규칙
- 메뉴/재료 삭제 시 연결된 이미지 파일 삭제
- 메뉴/재료 이미지 변경 시 이전 이미지 파일 삭제
- 파일이 존재하지 않아도 에러 발생하지 않음 (graceful)

---

## 7. API 응답 형식 규칙

### BR-R01: 표준 응답 형식

**성공 응답:**
```json
{
  "success": true,
  "data": { ... }
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

### BR-R02: HTTP 상태 코드 규칙
| 상태 코드 | 사용 상황 |
|-----------|-----------|
| 200 | 조회, 수정, 삭제 성공 |
| 201 | 생성 성공 |
| 400 | 유효성 검증 실패, 비즈니스 규칙 위반 |
| 401 | 인증 실패 (토큰 없음, 만료, 변조) |
| 403 | 권한 부족 (table이 admin 전용 접근) |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 데이터) |
| 429 | 요청 제한 (계정 잠금) |
| 500 | 서버 내부 오류 |

### BR-R03: 에러 핸들링 규칙
- 모든 에러는 전역 errorHandler 미들웨어에서 처리
- 예상된 에러: 적절한 HTTP 코드 + 사용자 친화적 메시지
- 예상치 못한 에러: 500 + "서버 오류가 발생했습니다" (상세 로그는 서버에만)
- TypeORM 에러: 적절한 HTTP 코드로 변환 (예: duplicate entry → 409)

---

## 8. 데이터 무결성 규칙

### BR-D01: 트랜잭션 필수 작업
| 작업 | 이유 |
|------|------|
| 주문 생성 (Order + OrderItem) | 부분 생성 방지 |
| 테이블 이용 완료 (이력 이동 + 삭제 + 세션 종료) | 데이터 불일치 방지 |
| 메뉴 순서 변경 (다수 레코드 업데이트) | 순서 꼬임 방지 |

### BR-D02: 매장 격리 (Multi-tenancy)
- 모든 조회/수정/삭제 시 storeId 일치 확인 필수
- 다른 매장의 데이터 접근 불가
- 인증 토큰의 storeId와 요청 대상의 storeId 비교

### BR-D03: 동시성 처리
- 주문 번호 생성: 동일 시점 중복 방지 (DB UNIQUE + 재시도 로직)
- 세션 생성: 동일 테이블 중복 세션 방지 (조회 후 생성, UNIQUE 제약)
