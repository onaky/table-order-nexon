# Unit of Work Plan

## 개요
테이블오더 서비스를 개발 가능한 단위(Unit of Work)로 분해합니다.
모노레포 구조 (frontend/ + backend/)이며, 각 Unit은 독립적으로 개발/테스트 가능한 기능 단위입니다.

---

## 질문

## Question 1: Unit 분해 전략
시스템을 어떤 기준으로 Unit으로 분해할까요?

A) 레이어 기반 (Unit 1: Backend API 전체 → Unit 2: Frontend 전체)
B) 기능 도메인 기반 (Unit 1: 인증+테이블 → Unit 2: 메뉴+재료 → Unit 3: 주문+대시보드)
C) 사용자 기반 (Unit 1: 고객용 전체 → Unit 2: 관리자용 전체 → Unit 3: 공통 백엔드)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2: 개발 순서 우선순위
어떤 기능부터 먼저 개발하고 싶으신가요?

A) 백엔드 API 먼저 → 프론트엔드 나중에 (API 완성 후 UI 연결)
B) 기본 기능 수직 슬라이스 (메뉴 조회: BE+FE 함께 → 주문: BE+FE 함께)
C) 프론트엔드 먼저 (목업 데이터) → 백엔드 나중에 연결
X) Other (please describe after [Answer]: tag below)

[Answer]: X. FE는 목업, BE와 병행해서 각자 개발, 최종 연동

---

## 생성 실행 계획

### Step 1: Unit 정의
- [x] Unit 목록 및 범위 정의
- [x] 각 Unit의 포함 컴포넌트 명시
- [x] Unit별 완료 기준 정의

### Step 2: Unit 의존성 매핑
- [x] Unit 간 의존 관계 정의
- [x] 개발 순서 결정
- [x] 병렬 개발 가능 여부 식별

### Step 3: Story-Unit 매핑
- [x] 각 User Story를 Unit에 할당
- [x] 미할당 Story 없는지 검증
- [x] Unit별 Story 수 균형 확인

### Step 4: 검증
- [x] 모든 Story가 Unit에 할당되었는지 확인
- [x] Unit 간 순환 의존성 없는지 확인
- [x] 각 Unit이 독립적으로 테스트 가능한지 확인
