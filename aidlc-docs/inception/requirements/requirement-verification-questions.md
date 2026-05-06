# Requirements Verification Questions

테이블오더 프로젝트의 요구사항을 명확히 하기 위한 질문입니다.
각 질문의 [Answer]: 태그 뒤에 선택한 옵션 문자를 입력해 주세요.

---

## Question 1: Tech Stack - Frontend Framework
고객용/관리자용 프론트엔드에 사용할 프레임워크는 무엇인가요?

A) React + TypeScript (생태계 풍부, 커뮤니티 대규모)
B) Next.js + TypeScript (React 기반 SSR/SSG, 라우팅 내장)
C) Vue 3 + TypeScript (직관적 API, 빠른 개발 속도)
D) Svelte/SvelteKit + TypeScript (경량, 빠른 런타임 성능)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2: Tech Stack - Backend Framework
서버 시스템에 사용할 백엔드 프레임워크는 무엇인가요?

A) Node.js + Express + TypeScript (JavaScript 풀스택, 빠른 개발)
B) Node.js + NestJS + TypeScript (구조화된 아키텍처, DI 지원)
C) Python + FastAPI (빠른 성능, 자동 API 문서)
D) Java + Spring Boot (엔터프라이즈급, 안정성)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3: Tech Stack - Database
데이터 저장소로 사용할 데이터베이스는 무엇인가요?

A) PostgreSQL (관계형, 강력한 기능, 확장성)
B) MySQL (관계형, 널리 사용, 안정적)
C) SQLite (경량, 서버리스, 프로토타입에 적합)
D) MongoDB (NoSQL, 유연한 스키마, 빠른 개발)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4: UI/UX 디자인 스타일
차별화된 세련된 디자인을 위해 어떤 스타일을 선호하시나요?

A) 모던 미니멀리즘 (깔끔한 여백, 부드러운 그림자, 글래스모피즘 효과)
B) 다크 모드 중심 프리미엄 (어두운 배경, 네온 액센트, 고급스러운 느낌)
C) 컬러풀 & 플레이풀 (밝은 그라데이션, 재미있는 마이크로 인터랙션)
D) 레스토랑 감성 내추럴 (따뜻한 톤, 음식 사진 강조, 고급 레스토랑 느낌)
X) Other (please describe after [Answer]: tag below)

[Answer]: X. B 느낌 기반에 다음 내용도 함께 참고해줘. 메뉴에 재료를 나열하고 재료의 칼로리 혹은 맛 혹은 이러한 상세정보가 있고 재료마다의 이미지가 별도로 있어서 이 음식이 어떠한 재료들로 구성되어있는지 유저가 직관적으로 파악해서 비건이나 관리하는 사람들에게 선택에 도움을 줄 수 있도록 UI를 구성하고 싶어. 



메뉴의 상세페이지에는 배경은 블랙 배경, 중앙에는 메뉴가 있고

우측에는 메뉴에 들어가는 재료들이 세로로 나열되어 있는 형태로 구성하고 싶어. 그리고 메뉴는 마우스로 돌릴 수 있는 형태로 3D로 구성하고 싶어. 

---

## Question 5: 인터랙션 & 애니메이션 수준
UI 인터랙션과 애니메이션의 수준은 어느 정도를 원하시나요?

A) 풍부한 애니메이션 (페이지 전환, 카드 플립, 파티클 효과, 로딩 애니메이션 등)
B) 적절한 마이크로 인터랙션 (호버 효과, 부드러운 전환, 토스트 알림 애니메이션)
C) 최소한의 애니메이션 (기본 전환만, 성능 우선)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 6: CSS/스타일링 도구
스타일링에 사용할 도구는 무엇인가요?

A) Tailwind CSS (유틸리티 퍼스트, 빠른 개발, 커스터마이징 용이)
B) Styled-components / Emotion (CSS-in-JS, 컴포넌트 기반)
C) CSS Modules + SCSS (전통적, 스코프 격리)
D) shadcn/ui + Tailwind (미리 만들어진 고품질 컴포넌트 + Tailwind)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7: 실시간 통신 구현 방식
관리자 대시보드의 실시간 주문 업데이트 구현 방식은?

A) Server-Sent Events (SSE) - 요구사항 문서 기준, 단방향 실시간 통신
B) WebSocket - 양방향 실시간 통신, 더 유연한 확장 가능
C) Polling (3초 간격) - 단순 구현, 서버 부하 고려
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8: 배포 환경
프로젝트의 배포 환경은 어디인가요?

A) AWS (EC2/ECS + RDS + CloudFront)
B) Docker Compose 기반 로컬/온프레미스
C) Vercel (프론트) + Railway/Render (백엔드)
D) 배포는 고려하지 않음 (로컬 개발 환경에서만 실행)
X) Other (please describe after [Answer]: tag below)

[Answer]: X. 로컬 개발 먼저하고 배포는 완료된 후에 진행하자.

---

## Question 9: 차별화 포인트 - 특별히 원하는 기능
다른 팀과 차별화를 위해 특별히 추가하고 싶은 기능이 있나요? (복수 선택 가능, 쉼표로 구분)

A) 실시간 주문 상태 애니메이션 (주문 → 준비중 → 완료 시각적 플로우)
B) 테이블별 실시간 매출 차트/통계 대시보드
C) 드래그 앤 드롭 메뉴 순서 관리
D) 다크/라이트 모드 토글
E) 주문 완료 시 축하 애니메이션/사운드 효과
X) Other (please describe after [Answer]: tag below)

[Answer]: A,B,C

---

## Question 10: 메뉴 이미지 처리
메뉴 이미지는 어떻게 처리할 예정인가요?

A) 외부 URL 직접 입력 (이미지 호스팅은 별도)
B) 로컬 파일 업로드 (서버에 저장)
C) 플레이스홀더 이미지 사용 (데모용 더미 이미지)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 11: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용할까요?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션급 애플리케이션 권장)
B) No — 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 12: Property-Based Testing Extension
이 프로젝트에 Property-Based Testing (PBT) 규칙을 적용할까요?

A) Yes — 모든 PBT 규칙을 blocking constraint로 적용 (비즈니스 로직, 데이터 변환이 있는 프로젝트 권장)
B) Partial — 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용
C) No — 모든 PBT 규칙 건너뛰기 (단순 CRUD, UI 전용 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 13: 모노레포 vs 분리 레포
프론트엔드와 백엔드의 코드 구조는 어떻게 하시겠어요?

A) 모노레포 (하나의 레포에 frontend/, backend/ 디렉토리 분리)
B) 분리 레포 (프론트엔드, 백엔드 각각 별도 레포)
C) 풀스택 프레임워크 (Next.js API Routes 등으로 하나의 프로젝트)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
