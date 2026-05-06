# Frontend Components - Detailed Design

## 1. 3D 메뉴 뷰어 (Menu3DViewer)

### 구현 전략: 이미지 기반 가상 3D 카드 회전

```typescript
// React Three Fiber를 사용한 이미지 카드 3D 회전
interface Menu3DViewerProps {
  imageUrl: string;
  name: string;
}
```

### 동작 방식
- 메뉴 이미지를 3D 평면(Plane)에 텍스처로 매핑
- 약간의 두께를 가진 카드 형태 (RoundedBox)
- OrbitControls로 마우스 드래그 / 터치 스와이프 회전
- 자동 회전 (autoRotate) + 사용자 인터랙션 시 멈춤
- 블랙 배경 + 부드러운 조명 (ambient + directional)

### Three.js 씬 구성
```
Scene
├── AmbientLight (intensity: 0.5)
├── DirectionalLight (position: [5, 5, 5])
├── RoundedBox (메뉴 이미지 텍스처)
│   ├── Front face: 메뉴 이미지
│   └── Back face: 메뉴 이름 + 가격
└── OrbitControls
    ├── enableZoom: false
    ├── enablePan: false
    ├── autoRotate: true
    └── autoRotateSpeed: 2
```

### 폴백 전략
- 3D 로딩 실패 시: 정적 이미지 표시
- WebGL 미지원 시: `<img>` 태그로 폴백
- 로딩 중: 스켈레톤 애니메이션

---

## 2. 메뉴 상세 페이지 레이아웃 (MenuDetailPage)

### 레이아웃 구조
```
+--------------------------------------------------+
|  ← 뒤로가기                          [장바구니 추가] |
+--------------------------------------------------+
|                                    |              |
|                                    |  재료 1      |
|                                    |  [이미지]    |
|         [3D 메뉴 뷰어]              |  이름 / kcal |
|         (중앙, 큰 영역)             |              |
|                                    |  재료 2      |
|                                    |  [이미지]    |
|                                    |  이름 / kcal |
|                                    |              |
|                                    |  재료 3      |
|                                    |  [이미지]    |
+--------------------------------------------------+
|  메뉴명                                           |
|  가격                                             |
|  설명                                             |
+--------------------------------------------------+
```

### 반응형 비율
- 3D 뷰어 영역: 70% 너비
- 재료 목록 영역: 30% 너비
- 모바일(768px 이하): 세로 스택 (3D 위, 재료 아래)

---

## 3. 재료 목록 (IngredientList)

### 컴포넌트 구조
```typescript
interface IngredientListProps {
  ingredients: Ingredient[];
}

// 각 재료 아이템
interface IngredientItemProps {
  ingredient: Ingredient;
}
```

### 레이아웃 (세로 나열)
```
┌─────────────┐
│  [원형 이미지] │
│   재료명      │
│   120 kcal   │
│   🌶️ spicy   │
│   🌱 vegan   │
└─────────────┘
```

### 스타일링
- 원형 이미지 (w-12 h-12 rounded-full)
- 맛 프로필: 태그 형태 (작은 pill badge)
- 비건 표시: 🌱 아이콘 + 초록색 뱃지
- 스크롤 가능 (재료 많을 시 세로 스크롤)

---

## 4. 주문 경과 시간 인디케이터 (OrderTimeIndicator)

### 컴포넌트 구조
```typescript
interface OrderTimeIndicatorProps {
  createdAt: string;
  status: OrderStatus;
}
```

### 렌더링 로직
- `status === 'completed'`이면 표시하지 않음 (완료된 주문은 경과 시간 불필요)
- 1초마다 재렌더링 (useEffect + setInterval)
- 색상 단계에 따라 스타일 동적 변경

### 애니메이션 (Framer Motion)
```typescript
// 빨간색 단계 펄스 애니메이션
<motion.div
  animate={{ 
    scale: [1, 1.05, 1],
    boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.5)', '0 0 0 rgba(239,68,68,0)']
  }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

---

## 5. 대시보드 테이블 카드 (TableCard)

### 컴포넌트 구조
```typescript
interface TableCardProps {
  table: TableDashboard;
  onOrderClick: (order: Order) => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onDeleteOrder: (orderId: number) => void;
  onCompleteTable: (tableId: number) => void;
}
```

### 카드 레이아웃
```
┌──────────────────────────────┐
│  테이블 3          ₩45,000   │
├──────────────────────────────┤
│  [주문1] 시그니처 버거 x2     │
│  ⏱ 3분 전  🟢               │
│  [상태 변경 버튼]             │
├──────────────────────────────┤
│  [주문2] 파스타 x1           │
│  ⏱ 8분 전  🟡               │
│  [상태 변경 버튼]             │
├──────────────────────────────┤
│  [이용 완료]  [과거 내역]     │
└──────────────────────────────┘
```

### 신규 주문 하이라이트
- 새 주문 도착 시 카드 테두리 3초간 glow 효과
- Framer Motion `layoutId`로 부드러운 추가 애니메이션

---

## 6. 매출 차트 (SalesChart)

### 컴포넌트 구조
```typescript
interface SalesChartProps {
  tables: TableDashboard[];
}
```

### 차트 유형
- Recharts BarChart (테이블별 매출 바 차트)
- X축: 테이블 번호
- Y축: 매출액 (원)
- 색상: 다크 모드에 맞는 밝은 그라데이션 바

### 토글 기능
- 접기/펼치기 버튼 (대시보드 상단)
- 기본: 펼침 상태
- 접힌 상태: 오늘 총 매출만 한 줄 표시

---

## 7. 드래그 앤 드롭 메뉴 관리 (DragDropMenuList)

### 컴포넌트 구조
```typescript
interface DragDropMenuListProps {
  menus: Menu[];
  onReorder: (menuIds: number[]) => void;
}
```

### dnd-kit 구현
- `@dnd-kit/core` + `@dnd-kit/sortable` 사용
- 각 메뉴 항목에 드래그 핸들 (⋮⋮ 아이콘)
- 드래그 중: 반투명 + 그림자 + 드롭 위치 표시선
- 드롭 완료: 즉시 `onReorder` 호출 → 서버 저장 (낙관적 업데이트)
- 터치 지원: `@dnd-kit/core`의 TouchSensor

### 낙관적 업데이트 패턴
```typescript
// 1. UI 즉시 업데이트 (드롭 완료 시)
// 2. 서버에 새 순서 전송
// 3. 실패 시 이전 순서로 롤백 + 에러 토스트
```

---

## 8. 페이지별 상태 관리 요약

| 페이지 | 서버 상태 (React Query) | 클라이언트 상태 (Zustand) |
|--------|------------------------|--------------------------|
| MenuPage | useMenus, useCategories | useCartStore (뱃지 수량) |
| MenuDetailPage | useMenuDetail, useMenuIngredients | useCartStore |
| CartPage | - | useCartStore |
| OrderConfirmPage | useCreateOrder (mutation) | useCartStore |
| OrderHistoryPage | useOrders | - |
| DashboardPage | - | useOrderStore (SSE) |
| MenuManagementPage | useMenus, useMenuMutation | - |
| IngredientManagementPage | useIngredients, useIngredientMutation | - |

---

## 9. 애니메이션 설계 (Framer Motion)

| 요소 | 애니메이션 | 트리거 |
|------|-----------|--------|
| 페이지 전환 | fade + slide (opacity 0→1, y 20→0) | 라우트 변경 |
| 장바구니 추가 | scale bounce (1→1.2→1) | addItem |
| 토스트 알림 | slide in from top + fade out | 이벤트 발생 |
| 주문 상태 변경 | 색상 전환 (0.3s ease) | status 변경 |
| 경과 시간 경고 | pulse + glow (infinite) | 10분 초과 |
| 신규 주문 카드 | border glow (3초) | SSE new-order |
| 모달 | backdrop fade + scale (0.95→1) | 모달 열기 |
| 드래그 아이템 | opacity 0.5 + shadow | 드래그 시작 |
