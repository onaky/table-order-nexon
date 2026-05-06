# Business Logic Model - Backend API

## 1. 인증 플로우

### 1.1 테이블 로그인 플로우

```
Client Request (storeId, tableNo, password)
    │
    ▼
[1] Store 존재 확인 (storeId)
    │── 실패 → 404 "매장을 찾을 수 없습니다"
    ▼
[2] Table 존재 확인 (storeId + tableNo)
    │── 실패 → 404 "테이블을 찾을 수 없습니다"
    ▼
[3] 비밀번호 검증 (bcrypt.compare)
    │── 실패 → 401 "비밀번호가 일치하지 않습니다"
    ▼
[4] 기존 활성 세션 확인 (tableId, isActive=true)
    │── 있음 → 기존 세션 재사용
    │── 없음 → 새 세션 생성 (UUID v4)
    ▼
[5] JWT 토큰 발급
    Payload: { type: 'table', storeId, tableId, tableNo, sessionId }
    Expiry: 24시간
    ▼
[6] 응답 반환
    { token, table: { id, storeId, tableNo }, session: { sessionId, startedAt } }
```

### 1.2 관리자 로그인 플로우

```
Client Request (storeId, username, password)
    │
    ▼
[1] Admin 조회 (storeId + username)
    │── 실패 → 401 "인증 정보가 올바르지 않습니다"
    ▼
[2] 계정 잠금 확인
    │── lockedUntil > now → 429 "계정이 잠겨있습니다. N분 후 재시도"
    ▼
[3] 비밀번호 검증 (bcrypt.compare)
    │── 실패 → failedLoginAttempts++
    │         5회 이상 → lockedUntil = now + 15분
    │         401 "인증 정보가 올바르지 않습니다"
    ▼
[4] 로그인 성공 처리
    failedLoginAttempts = 0, lockedUntil = null
    ▼
[5] JWT 토큰 발급
    Payload: { type: 'admin', storeId, adminId, username }
    Expiry: 16시간
    ▼
[6] 응답 반환
    { token, admin: { id, storeId, username } }
```

### 1.3 토큰 검증 플로우 (Middleware)

```
Request Header: Authorization: Bearer <token>
    │
    ▼
[1] 토큰 존재 확인
    │── 없음 → 401 "인증 토큰이 필요합니다"
    ▼
[2] JWT 검증 (verify)
    │── 만료 → 401 "토큰이 만료되었습니다"
    │── 유효하지 않음 → 401 "유효하지 않은 토큰입니다"
    ▼
[3] 페이로드를 req.user에 저장
    req.user = { type, storeId, ... }
    ▼
[4] next() 호출
```

---

## 2. 주문 생성 플로우

```
Client Request (items: [{ menuId, quantity }])
    │
    ▼
[1] 인증 정보에서 storeId, tableId, sessionId 추출
    │
    ▼
[2] 활성 세션 확인 (sessionId, isActive=true)
    │── 실패 → 400 "활성 세션이 없습니다"
    ▼
[3] 메뉴 유효성 검증 (각 menuId)
    │── 존재하지 않는 메뉴 → 400 "메뉴를 찾을 수 없습니다: {menuName}"
    │── 판매 불가 메뉴 → 400 "현재 판매하지 않는 메뉴입니다: {menuName}"
    ▼
[4] 주문 번호 생성
    │  format: {storeId}-{MMDD}-{dailySequence}
    │  dailySequence: 해당 매장의 오늘 주문 수 + 1 (3자리 zero-pad)
    ▼
[5] 주문 생성 (트랜잭션)
    │  ┌─ Order 레코드 생성
    │  ├─ OrderItem 레코드 생성 (각 항목)
    │  │   - menuName: 현재 메뉴명 스냅샷
    │  │   - unitPrice: 현재 가격 스냅샷
    │  │   - subtotal: quantity × unitPrice
    │  └─ totalAmount: 모든 subtotal 합계
    ▼
[6] SSE 이벤트 발행
    event: 'new-order'
    data: { orderId, orderNumber, tableNo, items, totalAmount, createdAt }
    ▼
[7] 응답 반환
    { order: { id, orderNumber, status, totalAmount, items, createdAt } }
```

---

## 3. 주문 상태 변경 플로우

```
Client Request (orderId, status: 'preparing' | 'completed')
    │
    ▼
[1] 주문 조회 (orderId)
    │── 실패 → 404 "주문을 찾을 수 없습니다"
    ▼
[2] 상태 전이 유효성 검증
    │  허용: pending → preparing → completed
    │  불허: 역방향, 동일 상태, 건너뛰기
    │── 실패 → 400 "'{현재상태}'에서 '{요청상태}'로 변경할 수 없습니다"
    ▼
[3] 상태 업데이트
    │
    ▼
[4] SSE 이벤트 발행
    event: 'status-change'
    data: { orderId, orderNumber, tableNo, previousStatus, newStatus, updatedAt }
    ▼
[5] 응답 반환
    { order: { id, orderNumber, status, updatedAt } }
```

---

## 4. 주문 삭제 플로우

```
Client Request (orderId) — Admin Only
    │
    ▼
[1] 주문 조회 (orderId, storeId 일치 확인)
    │── 실패 → 404 "주문을 찾을 수 없습니다"
    ▼
[2] 주문 삭제 (CASCADE로 OrderItem도 삭제)
    │
    ▼
[3] SSE 이벤트 발행
    event: 'order-deleted'
    data: { orderId, orderNumber, tableNo, deletedAmount }
    ▼
[4] 응답 반환
    { message: "주문이 삭제되었습니다" }
```

---

## 5. 테이블 세션 라이프사이클

### 5.1 세션 시작 (고객 로그인 시)

```
테이블 로그인 요청
    │
    ▼
[1] 기존 활성 세션 확인
    │── 있음 → 기존 세션 반환 (재접속 케이스)
    │── 없음 ↓
    ▼
[2] 새 세션 생성
    sessionId: UUID v4
    startedAt: now
    isActive: true
    ▼
[3] 세션 정보 포함하여 토큰 발급
```

### 5.2 세션 종료 (관리자 이용 완료)

```
Admin Request: POST /api/tables/:id/complete
    │
    ▼
[1] 테이블 활성 세션 확인
    │── 없음 → 400 "활성 세션이 없습니다"
    ▼
[2] 트랜잭션 시작
    │
    ├─ [3] 현재 세션의 모든 주문 조회
    │
    ├─ [4] 각 주문 → OrderHistory로 이동
    │       - orderNumber, storeId, tableId, tableNo 복사
    │       - items: OrderItem 배열을 JSON으로 직렬화
    │       - orderedAt: 원본 createdAt
    │       - completedAt: now
    │
    ├─ [5] 현재 세션의 Order + OrderItem 삭제
    │
    ├─ [6] TableSession.endedAt = now, isActive = false
    │
    └─ 트랜잭션 커밋
    ▼
[7] SSE 이벤트 발행
    event: 'table-completed'
    data: { tableId, tableNo, sessionId, completedAt }
    ▼
[8] 응답 반환
    { message: "테이블 이용 완료 처리되었습니다" }
```

---

## 6. 메뉴 관리 플로우

### 6.1 메뉴 생성

```
Admin Request (name, price, description, categoryId, image?)
    │
    ▼
[1] 카테고리 존재 확인 (categoryId, storeId 일치)
    │── 실패 → 404 "카테고리를 찾을 수 없습니다"
    ▼
[2] 이미지 처리 (있는 경우)
    │  UploadService.saveImage(file) → imageUrl
    ▼
[3] sortOrder 결정
    │  해당 카테고리의 마지막 순서 + 1
    ▼
[4] Menu 레코드 생성
    ▼
[5] 응답 반환
    { menu: { id, name, price, description, categoryId, imageUrl, sortOrder } }
```

### 6.2 메뉴 순서 변경 (Reorder)

```
Admin Request (menuIds: number[]) — 순서대로 정렬된 ID 배열
    │
    ▼
[1] 모든 menuId가 동일 매장/카테고리인지 확인
    │── 실패 → 400 "잘못된 메뉴 목록입니다"
    ▼
[2] 트랜잭션으로 sortOrder 일괄 업데이트
    │  menuIds[0].sortOrder = 0
    │  menuIds[1].sortOrder = 1
    │  ...
    ▼
[3] 응답 반환
    { message: "메뉴 순서가 변경되었습니다" }
```

---

## 7. 재료 관리 플로우

### 7.1 메뉴에 재료 연결

```
Admin Request: POST /api/menus/:menuId/ingredients/:ingredientId
    │
    ▼
[1] Menu 존재 확인 (menuId, storeId 일치)
    │── 실패 → 404
    ▼
[2] Ingredient 존재 확인 (ingredientId, storeId 일치)
    │── 실패 → 404
    ▼
[3] 이미 연결 확인
    │── 이미 연결됨 → 409 "이미 연결된 재료입니다"
    ▼
[4] MenuIngredient 생성 (sortOrder = 마지막 + 1)
    ▼
[5] 응답 반환
    { message: "재료가 연결되었습니다" }
```

---

## 8. SSE (Server-Sent Events) 관리

### 8.1 클라이언트 연결

```
Client Request: GET /api/sse/orders?storeId=STORE01
    │
    ▼
[1] 인증 확인 (Admin Token)
    │
    ▼
[2] SSE 헤더 설정
    Content-Type: text/event-stream
    Cache-Control: no-cache
    Connection: keep-alive
    ▼
[3] 클라이언트 등록 (storeId → Response 매핑)
    │
    ▼
[4] 초기 데이터 전송 (선택)
    event: 'connected'
    data: { message: "SSE 연결 성공", storeId }
    ▼
[5] 연결 해제 감지 (req.on('close'))
    → 클라이언트 목록에서 제거
```

### 8.2 이벤트 브로드캐스트

```
SSEService.broadcastOrderEvent(storeId, event)
    │
    ▼
[1] storeId에 연결된 모든 클라이언트 조회
    │── 없음 → 무시 (연결된 관리자 없음)
    ▼
[2] 각 클라이언트에 이벤트 전송
    format: "event: {eventType}\ndata: {JSON}\n\n"
    ▼
[3] 전송 실패 클라이언트 자동 제거
```

### 8.3 SSE 이벤트 타입 정의

| 이벤트 | 발생 시점 | 페이로드 |
|--------|-----------|----------|
| `connected` | SSE 연결 성공 | `{ message, storeId }` |
| `new-order` | 주문 생성 | `{ orderId, orderNumber, tableNo, items: [{menuName, quantity, unitPrice}], totalAmount, createdAt }` |
| `status-change` | 주문 상태 변경 | `{ orderId, orderNumber, tableNo, previousStatus, newStatus, updatedAt }` |
| `order-deleted` | 주문 삭제 | `{ orderId, orderNumber, tableNo, deletedAmount }` |
| `table-completed` | 테이블 이용 완료 | `{ tableId, tableNo, sessionId, completedAt }` |

---

## 9. 파일 업로드 플로우

```
Admin Request: POST /api/uploads/image (multipart/form-data)
    │
    ▼
[1] Multer 미들웨어로 파일 수신
    │  제한: 5MB, 이미지 타입만 (jpeg, png, gif, webp)
    │── 초과 → 400 "파일 크기는 5MB 이하여야 합니다"
    │── 잘못된 타입 → 400 "이미지 파일만 업로드 가능합니다"
    ▼
[2] 파일명 생성
    format: {timestamp}-{random8chars}.{ext}
    예: 1715000000000-a1b2c3d4.jpg
    ▼
[3] uploads/ 디렉토리에 저장
    ▼
[4] 접근 URL 반환
    { imageUrl: "/uploads/1715000000000-a1b2c3d4.jpg" }
```

---

## 10. 주문 조회 플로우

### 10.1 고객 - 현재 세션 주문 조회

```
Client Request: GET /api/orders?tableId=&sessionId=
    │
    ▼
[1] 인증 정보에서 tableId, sessionId 추출 (또는 쿼리 파라미터)
    ▼
[2] 해당 세션의 주문 조회 (createdAt DESC)
    │  JOIN OrderItem
    ▼
[3] 응답 반환
    { orders: [{ id, orderNumber, status, totalAmount, items, createdAt }] }
```

### 10.2 관리자 - 매장 전체 주문 조회 (대시보드)

```
Client Request: GET /api/orders (Admin Token에서 storeId 추출)
    │
    ▼
[1] 현재 활성 세션의 모든 주문 조회
    │  조건: storeId 일치, 활성 세션에 속한 주문
    │  JOIN OrderItem, Table
    ▼
[2] 테이블별 그룹핑
    ▼
[3] 응답 반환
    { orders: [{ id, orderNumber, tableNo, status, totalAmount, items, createdAt }] }
```

### 10.3 관리자 - 과거 주문 이력 조회

```
Client Request: GET /api/tables/:tableId/history?date=2026-05-06
    │
    ▼
[1] 날짜 필터 적용 (없으면 전체)
    │  조건: storeId 일치, tableId 일치, completedAt 날짜 범위
    ▼
[2] 시간 역순 정렬
    ▼
[3] 응답 반환
    { history: [{ orderNumber, tableNo, items, totalAmount, orderedAt, completedAt }] }
```
