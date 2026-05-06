# Unit of Work - Story Map

## Story → Unit 매핑

### Unit 1: Backend API

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

### Unit 2: Frontend UI

| Story | 제목 | Priority |
|-------|------|----------|
| US-01 | 테이블 태블릿 자동 로그인 (UI) | Must |
| US-02 | 관리자 매장 인증 (UI) | Must |
| US-03 | 카테고리별 메뉴 탐색 (UI) | Must |
| US-04 | 메뉴 상세 정보 (UI) | Must |
| US-05 | 장바구니에 메뉴 추가 (UI) | Must |
| US-06 | 장바구니 관리 (UI - 클라이언트 전용) | Must |
| US-07 | 주문 생성 (UI) | Must |
| US-08 | 주문 내역 조회 (UI) | Must |
| US-09 | 실시간 주문 대시보드 (UI) | Must |
| US-10 | 주문 상태 변경 (UI) | Must |
| US-11 | 테이블 초기 설정 (UI) | Must |
| US-12 | 주문 삭제 (UI) | Must |
| US-13 | 테이블 이용 완료 (UI) | Must |
| US-14 | 과거 주문 내역 조회 (UI) | Should |
| US-15 | 메뉴 CRUD (UI) | Must |
| US-16 | 3D 메뉴 뷰 (UI 전용) | Should |
| US-17 | 재료 정보 확인 (UI) | Should |
| US-18 | 재료 관리 (UI) | Should |
| US-19 | 주문 상태 시각적 플로우 (UI 전용) | Should |
| US-20 | 주문 경과 시간 색상 단계 (UI) | Must |
| US-21 | 테이블별 실시간 매출 차트 (UI) | Should |
| US-22 | 메뉴 순서 드래그 앤 드롭 (UI) | Should |

### Unit 3: Integration

| Story | 제목 | Priority |
|-------|------|----------|
| 전체 | FE ↔ BE 연동 (모든 Story의 실제 API 연결) | Must |
| US-09 | SSE 실시간 연동 검증 | Must |
| US-20 | 경과 시간 실시간 업데이트 연동 | Must |

---

## 매핑 검증

### 미할당 Story 확인
- ✅ 모든 22개 Story가 최소 1개 Unit에 할당됨

### Unit별 Story 수
| Unit | Must | Should | 합계 |
|------|------|--------|------|
| Backend API | 13 | 5 | 18 |
| Frontend UI | 13 | 9 | 22 |
| Integration | 3 | 0 | 3 |

### 참고사항
- US-06 (장바구니 관리)은 클라이언트 전용 기능으로 Frontend UI에만 할당
- US-16 (3D 메뉴 뷰), US-19 (주문 상태 애니메이션), US-21 (매출 차트)은 Frontend UI 전용
- 대부분의 Story는 Backend + Frontend 양쪽에 할당 (API + UI 모두 필요)
