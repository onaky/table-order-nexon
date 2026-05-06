# Application Design Plan

## 개요
테이블오더 서비스의 애플리케이션 설계 계획서입니다.
요구사항과 User Stories를 기반으로 컴포넌트, 서비스, 의존성을 설계합니다.

---

## 질문

## Question 1: 프론트엔드 상태 관리
React 프론트엔드의 전역 상태 관리 방식은 무엇을 사용할까요?

A) Zustand (경량, 간단한 API, 보일러플레이트 최소)
B) Redux Toolkit (표준적, 미들웨어 풍부, 대규모 앱에 적합)
C) React Context + useReducer (내장 기능, 외부 의존성 없음)
D) Jotai / Recoil (원자적 상태, 세밀한 리렌더링 제어)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2: API 통신 라이브러리
프론트엔드에서 백엔드 API 호출에 사용할 라이브러리는?

A) Axios + React Query (TanStack Query) (캐싱, 자동 리페치, 로딩/에러 상태 관리)
B) Axios 단독 (간단, 직접 상태 관리)
C) Fetch API + React Query (네이티브 fetch + 캐싱 레이어)
D) SWR (Vercel 제작, 경량 데이터 페칭)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3: 프론트엔드 라우팅
고객용과 관리자용 인터페이스의 라우팅 구조는?

A) 단일 앱 + 경로 분리 (/customer/*, /admin/*)
B) 별도 앱 2개 (customer-app, admin-app)으로 완전 분리
C) 단일 앱 + 역할 기반 라우팅 (로그인 유형에 따라 분기)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4: 백엔드 ORM
데이터베이스 접근 계층에 사용할 ORM은?

A) Prisma (타입 안전, 자동 마이그레이션, 직관적 스키마)
B) TypeORM (데코레이터 기반, Active Record/Data Mapper 패턴)
C) Drizzle ORM (경량, SQL에 가까운 API, 타입 안전)
D) Knex.js (쿼리 빌더, ORM보다 유연, SQL 직접 제어)
X) Other (please describe after [Answer]: tag below)

[Answer]: TypeORM

---

## Question 5: 파일 업로드 저장 방식
메뉴/재료 이미지 파일의 서버 저장 방식은?

A) 로컬 파일 시스템 (uploads/ 디렉토리, 정적 파일 서빙)
B) 로컬 + 파일명 UUID 해싱 (충돌 방지, 정적 서빙)
C) SQLite/DB에 Base64 저장 (파일 시스템 의존 제거)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

아래 체크리스트는 질문 답변 후 순서대로 실행됩니다.

### Step 1: 컴포넌트 식별
- [x] 프론트엔드 컴포넌트 구조 정의 (페이지, 공통 컴포넌트, 레이아웃)
- [x] 백엔드 컴포넌트 구조 정의 (라우트, 컨트롤러, 서비스, 모델)
- [x] 컴포넌트 책임 범위 정의

### Step 2: 컴포넌트 메서드 정의
- [x] 프론트엔드 주요 훅/유틸 메서드 시그니처
- [x] 백엔드 컨트롤러 메서드 시그니처
- [x] 백엔드 서비스 메서드 시그니처

### Step 3: 서비스 레이어 설계
- [x] 백엔드 서비스 정의 및 오케스트레이션
- [x] SSE 이벤트 서비스 설계
- [x] 파일 업로드 서비스 설계

### Step 4: 의존성 관계 정의
- [x] 프론트엔드 컴포넌트 의존성
- [x] 백엔드 레이어 의존성 (Controller → Service → Model)
- [x] 프론트엔드 ↔ 백엔드 API 통신 매핑

### Step 5: 통합 문서 생성
- [x] components.md 생성
- [x] component-methods.md 생성
- [x] services.md 생성
- [x] component-dependency.md 생성
- [x] application-design.md (통합 문서) 생성
