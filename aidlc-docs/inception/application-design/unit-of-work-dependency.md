# Unit of Work Dependencies

## Dependency Matrix

| Unit | 의존 대상 | 의존 유형 | 설명 |
|------|-----------|-----------|------|
| Backend API | - | 없음 | 독립적으로 개발/테스트 가능 |
| Frontend UI | - | 없음 (목업 사용) | 목업 데이터로 독립 개발 |
| Integration | Backend API, Frontend UI | 양쪽 완료 필요 | 연동 단계 |

## 개발 순서 및 병행 전략

```
Phase 1 (병행 개발):
+-------------------+     +-------------------+
| Unit 1: Backend   |     | Unit 2: Frontend  |
| - DB 스키마        |     | - UI 컴포넌트      |
| - API 엔드포인트    |     | - 목업 데이터       |
| - 비즈니스 로직     |     | - 상태 관리        |
| - SSE 구현        |     | - 3D/애니메이션     |
+-------------------+     +-------------------+
         |                          |
         v                          v
Phase 2 (연동):
+-------------------------------------------+
| Unit 3: Integration                       |
| - API 클라이언트 연결                       |
| - 목업 제거                                |
| - E2E 플로우 검증                          |
| - SSE 실시간 연동 확인                      |
+-------------------------------------------+
```

## 병행 개발 가능 여부

| Unit 조합 | 병행 가능 | 조건 |
|-----------|-----------|------|
| Backend + Frontend | ✅ 가능 | FE는 목업 데이터 사용, API 인터페이스 사전 합의 |
| Backend + Integration | ❌ 불가 | Backend 완료 후 연동 |
| Frontend + Integration | ❌ 불가 | Frontend 완료 후 연동 |

## API 인터페이스 계약 (병행 개발 기준)

Backend와 Frontend가 병행 개발 시 합의해야 할 인터페이스:
- **API 엔드포인트 URL**: `component-dependency.md`의 API 매핑 참조
- **요청/응답 형식**: `{ success: boolean, data?: T, error?: string }`
- **인증 헤더**: `Authorization: Bearer <token>`
- **SSE 이벤트 형식**: `event: <type>\ndata: <json>\n\n`

이 계약은 Application Design에서 이미 정의되었으므로, 양쪽 Unit이 이를 준수하면 연동 시 충돌 최소화.

## 개발 우선순위

| 순서 | Unit | 이유 |
|------|------|------|
| 1 (동시) | Backend API | API 완성 → 연동 기반 |
| 1 (동시) | Frontend UI | 목업으로 독립 개발, UI/UX 빠른 확인 |
| 2 | Integration | 양쪽 완료 후 연동 |
