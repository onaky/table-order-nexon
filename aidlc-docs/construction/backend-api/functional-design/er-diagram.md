# ER Diagram - Backend API

## Mermaid ER Diagram

```mermaid
erDiagram
    Store ||--o{ Admin : "has"
    Store ||--o{ Table : "has"
    Store ||--o{ Category : "has"
    Store ||--o{ Ingredient : "has"
    Store ||--o{ OrderHistory : "has"

    Table ||--o{ TableSession : "has"

    TableSession ||--o{ Order : "has"

    Category ||--o{ Menu : "contains"

    Menu ||--o{ MenuIngredient : "has"
    Ingredient ||--o{ MenuIngredient : "has"

    Order ||--o{ OrderItem : "contains"
    Menu ||--o{ OrderItem : "referenced by"

    Store {
        INT id PK
        VARCHAR storeId UK
        VARCHAR name
        DATETIME createdAt
        DATETIME updatedAt
    }

    Admin {
        INT id PK
        VARCHAR storeId FK
        VARCHAR username
        VARCHAR password
        INT failedLoginAttempts
        DATETIME lockedUntil
        DATETIME createdAt
        DATETIME updatedAt
    }

    Table {
        INT id PK
        VARCHAR storeId FK
        INT tableNo
        VARCHAR password
        BOOLEAN isActive
        DATETIME createdAt
        DATETIME updatedAt
    }

    TableSession {
        INT id PK
        VARCHAR sessionId UK
        INT tableId FK
        VARCHAR storeId
        DATETIME startedAt
        DATETIME endedAt
        BOOLEAN isActive
    }

    Category {
        INT id PK
        VARCHAR storeId FK
        VARCHAR name
        INT sortOrder
        DATETIME createdAt
        DATETIME updatedAt
    }

    Menu {
        INT id PK
        VARCHAR storeId FK
        INT categoryId FK
        VARCHAR name
        INT price
        TEXT description
        VARCHAR imageUrl
        INT sortOrder
        BOOLEAN isAvailable
        DATETIME createdAt
        DATETIME updatedAt
    }

    Ingredient {
        INT id PK
        VARCHAR storeId FK
        VARCHAR name
        VARCHAR imageUrl
        INT calories
        VARCHAR flavor
        BOOLEAN isVegan
        VARCHAR allergyInfo
        DATETIME createdAt
        DATETIME updatedAt
    }

    MenuIngredient {
        INT id PK
        INT menuId FK
        INT ingredientId FK
        INT sortOrder
    }

    Order {
        INT id PK
        VARCHAR orderNumber UK
        VARCHAR storeId FK
        INT tableId FK
        VARCHAR sessionId FK
        ENUM status
        INT totalAmount
        DATETIME createdAt
        DATETIME updatedAt
    }

    OrderItem {
        INT id PK
        INT orderId FK
        INT menuId FK
        VARCHAR menuName
        INT quantity
        INT unitPrice
        INT subtotal
    }

    OrderHistory {
        INT id PK
        VARCHAR orderNumber
        VARCHAR storeId
        INT tableId
        INT tableNo
        VARCHAR sessionId
        VARCHAR status
        INT totalAmount
        JSON items
        DATETIME orderedAt
        DATETIME completedAt
    }
```

## 관계 요약 (텍스트)

```
Store (1) ─────┬──── (N) Admin
               ├──── (N) Table ──── (N) TableSession ──── (N) Order ──── (N) OrderItem
               ├──── (N) Category ──── (N) Menu ──────────────────────────────┘ (referenced)
               ├──── (N) Ingredient                         │
               └──── (N) OrderHistory                       │
                                                            │
                                          Menu (N) ──── MenuIngredient ──── (N) Ingredient
```

## CASCADE 규칙 시각화

```
Menu 삭제 ──→ MenuIngredient 자동 삭제 (CASCADE)
Ingredient 삭제 ──→ MenuIngredient 자동 삭제 (CASCADE)
Order 삭제 ──→ OrderItem 자동 삭제 (CASCADE)
Category 삭제 ──✕ Menu 존재 시 삭제 불가 (RESTRICT)
Table 삭제 ──✕ TableSession 존재 시 삭제 불가 (RESTRICT)
```

## 핵심 UNIQUE 제약

| 테이블 | UNIQUE 조합 | 목적 |
|--------|-------------|------|
| Store | storeId | 매장 식별자 유일성 |
| Admin | (storeId, username) | 매장 내 관리자명 유일 |
| Table | (storeId, tableNo) | 매장 내 테이블 번호 유일 |
| TableSession | sessionId | 세션 UUID 유일 |
| MenuIngredient | (menuId, ingredientId) | 중복 연결 방지 |
| Order | orderNumber | 주문 번호 유일 |
