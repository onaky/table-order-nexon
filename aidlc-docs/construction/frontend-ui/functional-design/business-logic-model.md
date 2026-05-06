# Business Logic Model - Frontend UI

## 1. 장바구니 로직

### 상태 구조
```typescript
interface CartState {
  items: CartItem[];
  // Computed
  totalAmount: number;  // sum(item.price * item.quantity)
  itemCount: number;    // sum(item.quantity)
}
```

### 동작 규칙
| Action | 로직 | 부수 효과 |
|--------|------|-----------|
| `addItem(menu)` | 동일 메뉴 존재 시 quantity+1, 없으면 새 항목 추가 | localStorage 동기화 |
| `removeItem(menuId)` | 해당 항목 제거 | localStorage 동기화 |
| `updateQuantity(menuId, qty)` | qty < 1이면 제거, 아니면 수량 업데이트 | localStorage 동기화 |
| `clearCart()` | 전체 항목 제거 | localStorage 제거 |

### localStorage 동기화
- Key: `table-order-cart-{storeId}-{tableNo}`
- 저장 시점: 모든 상태 변경 시 즉시
- 복원 시점: 앱 초기화 시 (Zustand persist middleware)
- 형식: JSON.stringify(items)

---

## 2. 주문 생성 플로우

```
[장바구니 확인] → [주문 확정 버튼] → [API 호출]
                                         ↓
                              ┌─── 성공 ───┐─── 실패 ───┐
                              ↓            ↓            ↓
                    [주문번호 표시]   [장바구니 비우기]  [에러 메시지]
                    [5초 카운트다운]                    [장바구니 유지]
                              ↓
                    [메뉴 화면 리다이렉트]
```

### 상세 로직
1. **주문 확인 화면**: CartPage에서 "주문하기" → OrderConfirmPage로 이동
2. **최종 확인**: 주문 내역 표시 + "주문 확정" 버튼
3. **API 호출**: `POST /api/orders` (목업 모드에서는 mock 응답)
4. **성공 처리**:
   - OrderSuccessPage로 이동
   - 주문 번호 표시 (날짜-순번 형식: "0506-001")
   - 5초 카운트다운 표시
   - `clearCart()` 호출
   - 5초 후 `/customer/menu`로 자동 리다이렉트
5. **실패 처리**:
   - 에러 토스트 표시
   - 장바구니 유지
   - OrderConfirmPage에 머무름

---

## 3. 인증 플로우

### 테이블 자동 로그인
```
[앱 시작] → [localStorage에 인증 정보 있음?]
                    ↓ Yes                    ↓ No
          [토큰 유효성 검증]         [CustomerLoginPage 표시]
                    ↓                        ↓
          ┌── 유효 ──┐── 만료 ──┐    [매장ID + 테이블번호 + 비밀번호 입력]
          ↓          ↓          ↓            ↓
    [메뉴 화면]  [재로그인 시도]  [로그인 API 호출]
                                             ↓
                                    [토큰 + 테이블 정보 저장]
                                             ↓
                                    [메뉴 화면 이동]
```

### 관리자 로그인
```
[AdminLoginPage] → [매장ID + 사용자명 + 비밀번호 입력]
                          ↓
                   [로그인 API 호출]
                          ↓
              ┌─── 성공 ───┐─── 실패 ───┐
              ↓                         ↓
    [JWT 토큰 저장]              [에러 메시지 표시]
    [대시보드 이동]              [재시도 가능]
```

### 토큰 관리
- 저장: localStorage (`auth-token`, `auth-info`)
- 만료 체크: API 호출 시 401 응답 → 자동 로그아웃
- 관리자 세션: 16시간 후 자동 만료
- Axios interceptor에서 토큰 자동 첨부

---

## 4. SSE 연결 및 이벤트 처리

### 연결 관리
```typescript
// 관리자 대시보드 진입 시 연결
const eventSource = new EventSource(`/api/sse/orders?storeId=${storeId}`);

// 이벤트 핸들러
eventSource.addEventListener('new-order', (e) => {
  const { order } = JSON.parse(e.data);
  // orderStore에 추가
});

eventSource.addEventListener('status-change', (e) => {
  const { orderId, status } = JSON.parse(e.data);
  // 해당 주문 상태 업데이트
});

eventSource.addEventListener('order-deleted', (e) => {
  const { orderId, tableId } = JSON.parse(e.data);
  // 해당 주문 제거, 테이블 총액 재계산
});

eventSource.addEventListener('table-completed', (e) => {
  const { tableId } = JSON.parse(e.data);
  // 해당 테이블 리셋
});

// 페이지 이탈 시 연결 해제
eventSource.close();
```

### 재연결 로직
- EventSource는 자동 재연결 지원 (브라우저 내장)
- 연결 상태 표시 (connected/disconnected 인디케이터)
- 목업 모드: setInterval로 가짜 이벤트 생성

---

## 5. 경과 시간 계산 및 색상 단계

### 계산 로직
```typescript
function getElapsedMinutes(createdAt: string): number {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  return Math.floor((now - created) / 60000);
}

function getTimeColor(minutes: number): 'green' | 'yellow' | 'red' {
  if (minutes < 5) return 'green';
  if (minutes < 10) return 'yellow';
  return 'red';
}

function getTimeLabel(createdAt: string): string {
  const minutes = getElapsedMinutes(createdAt);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  return `${Math.floor(minutes / 60)}시간 전`;
}
```

### UI 업데이트 전략
- `setInterval(1000)` → 1초마다 경과 시간 재계산
- 컴포넌트 마운트 시 interval 시작, 언마운트 시 정리
- 색상 변경 시 Framer Motion으로 부드러운 전환
- 빨간색(10분+) 단계에서 펄스 애니메이션 활성화

### Tailwind 색상 매핑
```
green  → text-emerald-400, border-emerald-400, bg-emerald-400/10
yellow → text-amber-400, border-amber-400, bg-amber-400/10
red    → text-red-400, border-red-400, bg-red-400/10, animate-pulse
```
