# Domain Entities - Backend API

## Entity Relationship Overview

```
Store (1) ──── (N) Admin
Store (1) ──── (N) Table
Store (1) ──── (N) Category
Table (1) ──── (N) TableSession
TableSession (1) ──── (N) Order
Category (1) ──── (N) Menu
Menu (1) ──── (N) MenuIngredient (N) ──── (1) Ingredient
Order (1) ──── (N) OrderItem
OrderItem (N) ──── (1) Menu
Store (1) ──── (N) OrderHistory
```

---

## Entity Definitions

### Store (매장)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 매장 고유 ID |
| storeId | VARCHAR(50) | UNIQUE, NOT NULL | 매장 식별자 (로그인용) |
| name | VARCHAR(100) | NOT NULL | 매장명 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 생성일시 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `UNIQUE(storeId)`

---

### Admin (관리자)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 관리자 고유 ID |
| storeId | VARCHAR(50) | NOT NULL, FK(Store.storeId) | 소속 매장 |
| username | VARCHAR(50) | NOT NULL | 사용자명 |
| password | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| failedLoginAttempts | INT | NOT NULL, DEFAULT 0 | 연속 로그인 실패 횟수 |
| lockedUntil | DATETIME | NULLABLE | 계정 잠금 해제 시각 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 생성일시 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `UNIQUE(storeId, username)`

---

### Table (테이블)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 테이블 고유 ID |
| storeId | VARCHAR(50) | NOT NULL, FK(Store.storeId) | 소속 매장 |
| tableNo | INT | NOT NULL | 테이블 번호 |
| password | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | 활성 상태 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 생성일시 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `UNIQUE(storeId, tableNo)`

---

### TableSession (테이블 세션)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 세션 고유 ID |
| sessionId | VARCHAR(36) | UNIQUE, NOT NULL | UUID 세션 식별자 |
| tableId | INT | NOT NULL, FK(Table.id) | 테이블 참조 |
| storeId | VARCHAR(50) | NOT NULL | 매장 식별자 |
| startedAt | DATETIME | NOT NULL, DEFAULT NOW | 세션 시작 시각 |
| endedAt | DATETIME | NULLABLE | 세션 종료 시각 |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | 활성 여부 |

**인덱스**: `INDEX(tableId, isActive)`, `INDEX(storeId, isActive)`

**비즈니스 규칙**: 
- 고객이 테이블 태블릿에 로그인할 때 세션 시작 (Answer Q1: C)
- 테이블당 활성 세션은 최대 1개
- 이용 완료 시 endedAt 기록, isActive = false

---

### Category (카테고리)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 카테고리 고유 ID |
| storeId | VARCHAR(50) | NOT NULL, FK(Store.storeId) | 소속 매장 |
| name | VARCHAR(50) | NOT NULL | 카테고리명 |
| sortOrder | INT | NOT NULL, DEFAULT 0 | 정렬 순서 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 생성일시 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `INDEX(storeId, sortOrder)`

---

### Menu (메뉴)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 메뉴 고유 ID |
| storeId | VARCHAR(50) | NOT NULL, FK(Store.storeId) | 소속 매장 |
| categoryId | INT | NOT NULL, FK(Category.id) | 카테고리 참조 |
| name | VARCHAR(100) | NOT NULL | 메뉴명 |
| price | INT | NOT NULL | 가격 (원 단위) |
| description | TEXT | NULLABLE | 메뉴 설명 |
| imageUrl | VARCHAR(500) | NULLABLE | 메뉴 이미지 경로 |
| sortOrder | INT | NOT NULL, DEFAULT 0 | 카테고리 내 정렬 순서 |
| isAvailable | BOOLEAN | NOT NULL, DEFAULT true | 판매 가능 여부 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 생성일시 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `INDEX(storeId, categoryId, sortOrder)`, `INDEX(categoryId)`

---

### Ingredient (재료)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 재료 고유 ID |
| storeId | VARCHAR(50) | NOT NULL, FK(Store.storeId) | 소속 매장 |
| name | VARCHAR(100) | NOT NULL | 재료명 |
| imageUrl | VARCHAR(500) | NULLABLE | 재료 이미지 경로 |
| calories | INT | NULLABLE | 칼로리 (kcal) |
| flavor | VARCHAR(50) | NULLABLE | 맛 프로필 (매운맛, 단맛, 짠맛, 신맛, 감칠맛) |
| isVegan | BOOLEAN | NOT NULL, DEFAULT false | 비건 여부 |
| allergyInfo | VARCHAR(200) | NULLABLE | 알레르기 정보 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 생성일시 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `INDEX(storeId)`

---

### MenuIngredient (메뉴-재료 연결)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 연결 고유 ID |
| menuId | INT | NOT NULL, FK(Menu.id) ON DELETE CASCADE | 메뉴 참조 |
| ingredientId | INT | NOT NULL, FK(Ingredient.id) ON DELETE CASCADE | 재료 참조 |
| sortOrder | INT | NOT NULL, DEFAULT 0 | 표시 순서 |

**인덱스**: `UNIQUE(menuId, ingredientId)`, `INDEX(menuId)`, `INDEX(ingredientId)`

---

### Order (주문)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 주문 고유 ID |
| orderNumber | VARCHAR(30) | UNIQUE, NOT NULL | 주문 번호 (STORE01-0506-001) |
| storeId | VARCHAR(50) | NOT NULL, FK(Store.storeId) | 매장 식별자 |
| tableId | INT | NOT NULL, FK(Table.id) | 테이블 참조 |
| sessionId | VARCHAR(36) | NOT NULL, FK(TableSession.sessionId) | 세션 참조 |
| status | ENUM('pending','preparing','completed') | NOT NULL, DEFAULT 'pending' | 주문 상태 |
| totalAmount | INT | NOT NULL | 총 금액 (원) |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 주문 생성 시각 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 수정일시 |

**인덱스**: `UNIQUE(orderNumber)`, `INDEX(storeId, status)`, `INDEX(tableId, sessionId)`, `INDEX(storeId, createdAt)`

**주문 번호 규칙** (Answer Q2: C): `{storeId}-{MMDD}-{dailySequence}`
- 예: `STORE01-0506-001`, `STORE01-0506-002`
- dailySequence는 매장별 일일 순번 (매일 001부터 시작)

---

### OrderItem (주문 항목)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 항목 고유 ID |
| orderId | INT | NOT NULL, FK(Order.id) ON DELETE CASCADE | 주문 참조 |
| menuId | INT | NOT NULL, FK(Menu.id) | 메뉴 참조 |
| menuName | VARCHAR(100) | NOT NULL | 주문 시점 메뉴명 (스냅샷) |
| quantity | INT | NOT NULL | 수량 |
| unitPrice | INT | NOT NULL | 주문 시점 단가 (스냅샷) |
| subtotal | INT | NOT NULL | 소계 (quantity × unitPrice) |

**인덱스**: `INDEX(orderId)`, `INDEX(menuId)`

---

### OrderHistory (과거 주문 이력)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INT | PK, AUTO_INCREMENT | 이력 고유 ID |
| orderNumber | VARCHAR(30) | NOT NULL | 원본 주문 번호 |
| storeId | VARCHAR(50) | NOT NULL | 매장 식별자 |
| tableId | INT | NOT NULL | 테이블 ID |
| tableNo | INT | NOT NULL | 테이블 번호 (스냅샷) |
| sessionId | VARCHAR(36) | NOT NULL | 세션 ID |
| status | VARCHAR(20) | NOT NULL | 최종 상태 |
| totalAmount | INT | NOT NULL | 총 금액 |
| items | JSON | NOT NULL | 주문 항목 JSON (스냅샷) |
| orderedAt | DATETIME | NOT NULL | 원본 주문 시각 |
| completedAt | DATETIME | NOT NULL | 이력 이동 시각 (세션 종료 시각) |

**인덱스**: `INDEX(storeId, tableId, completedAt)`, `INDEX(storeId, completedAt)`

**설계 결정**: OrderHistory는 정규화하지 않고 JSON으로 items를 저장. 이유:
- 과거 이력은 조회 전용 (수정 없음)
- 메뉴 삭제/변경 시에도 이력 보존
- 조인 없이 빠른 조회 가능

---

## Entity Relationship Constraints

### CASCADE 규칙

| 부모 삭제 시 | 자식 동작 | 이유 |
|-------------|-----------|------|
| Menu 삭제 | MenuIngredient CASCADE 삭제 | 메뉴 없으면 연결 무의미 |
| Ingredient 삭제 | MenuIngredient CASCADE 삭제 | 재료 없으면 연결 무의미 |
| Order 삭제 | OrderItem CASCADE 삭제 | 주문 없으면 항목 무의미 |
| Category 삭제 | Menu는 삭제 불가 (RESTRICT) | 메뉴가 있는 카테고리 삭제 방지 |
| Table 삭제 | TableSession은 삭제 불가 (RESTRICT) | 세션 이력 보존 |

### 데이터 스냅샷 전략

주문 시점의 데이터를 보존하기 위해:
- `OrderItem.menuName`: 주문 시점 메뉴명 (메뉴 이름 변경 시에도 원본 유지)
- `OrderItem.unitPrice`: 주문 시점 단가 (가격 변경 시에도 원본 유지)
- `OrderHistory.items`: 전체 주문 항목 JSON 스냅샷
- `OrderHistory.tableNo`: 테이블 번호 스냅샷
