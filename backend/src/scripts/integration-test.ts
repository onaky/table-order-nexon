/**
 * FE-BE 연동 테스트 스크립트
 * FE의 vite proxy를 통해 BE API를 호출하여 연동 확인
 * 실행: npx ts-node src/scripts/integration-test.ts
 */

const FE_URL = 'http://localhost:3000'; // FE vite dev server (proxy -> BE:4000)
const BE_URL = 'http://localhost:4000'; // BE 직접

async function request(baseUrl: string, method: string, path: string, body?: any, token?: string): Promise<{ status: number; data: any }> {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return { status: res.status, data };
}

function log(label: string, result: { status: number; data: any }, expected?: number) {
  const success = expected ? result.status === expected : result.data.success;
  const icon = success ? '✅' : '❌';
  console.log(`${icon} [${result.status}] ${label}`);
  if (!result.data.success && result.data.error) {
    console.log(`   → ${result.data.error}`);
  }
}

async function runTests() {
  console.log('=== FE-BE 연동 테스트 ===\n');

  // ============================================
  // 1. Proxy 연동 확인 (FE port를 통해 BE API 호출)
  // ============================================
  console.log('--- 1. Vite Proxy 연동 확인 ---');

  const proxyLogin = await request(FE_URL, 'POST', '/api/auth/admin/login', {
    storeId: 'STORE01', username: 'admin', password: 'admin123'
  });
  log('FE proxy → BE 관리자 로그인', proxyLogin);
  const adminToken = proxyLogin.data.data?.token;

  const directLogin = await request(BE_URL, 'POST', '/api/auth/admin/login', {
    storeId: 'STORE01', username: 'admin', password: 'admin123'
  });
  log('BE 직접 관리자 로그인', directLogin);

  if (!adminToken) {
    console.log('\n❌ 토큰 발급 실패. 테스트 중단.');
    return;
  }

  // ============================================
  // 2. 테이블 로그인 (세션 생성 포함)
  // ============================================
  console.log('\n--- 2. 테이블 로그인 + 세션 ---');

  const tableLogin = await request(FE_URL, 'POST', '/api/auth/table/login', {
    storeId: 'STORE01', tableNo: 3, password: '1234'
  });
  log('테이블 3 로그인 (세션 생성)', tableLogin);
  const tableToken = tableLogin.data.data?.token;

  // ============================================
  // 3. 메뉴/카테고리 조회 (proxy 경유)
  // ============================================
  console.log('\n--- 3. 데이터 조회 (proxy 경유) ---');

  const categories = await request(FE_URL, 'GET', '/api/categories', undefined, adminToken);
  log(`카테고리 조회 (${categories.data.data?.length}개)`, categories);

  const menus = await request(FE_URL, 'GET', '/api/menus', undefined, tableToken);
  log(`메뉴 조회 (${menus.data.data?.length}개)`, menus);

  const menuDetail = await request(FE_URL, 'GET', '/api/menus/1', undefined, tableToken);
  const ingCount = menuDetail.data.data?.menuIngredients?.length ?? 0;
  log(`메뉴 상세 (재료 ${ingCount}개)`, menuDetail);

  const ingredients = await request(FE_URL, 'GET', '/api/menus/1/ingredients', undefined, tableToken);
  log(`메뉴 1 재료 조회 (${ingredients.data.data?.length}개)`, ingredients);

  // ============================================
  // 4. 주문 플로우 (proxy 경유)
  // ============================================
  console.log('\n--- 4. 주문 전체 플로우 ---');

  const createOrder = await request(FE_URL, 'POST', '/api/orders', {
    items: [{ menuId: 1, quantity: 2 }, { menuId: 5, quantity: 1 }]
  }, tableToken);
  log(`주문 생성 (${createOrder.data.data?.orderNumber})`, createOrder);
  const orderId = createOrder.data.data?.id;

  const getOrders = await request(FE_URL, 'GET', '/api/orders', undefined, tableToken);
  log(`고객 주문 조회 (${getOrders.data.data?.length}개)`, getOrders);

  const adminOrders = await request(FE_URL, 'GET', '/api/orders', undefined, adminToken);
  log(`관리자 주문 조회 (${adminOrders.data.data?.length}개)`, adminOrders);

  // 상태 변경
  const toPreparing = await request(FE_URL, 'PUT', `/api/orders/${orderId}/status`, { status: 'preparing' }, adminToken);
  log('상태: pending → preparing', toPreparing);

  const toCompleted = await request(FE_URL, 'PUT', `/api/orders/${orderId}/status`, { status: 'completed' }, adminToken);
  log('상태: preparing → completed', toCompleted);

  // ============================================
  // 5. 테이블 관리 (proxy 경유)
  // ============================================
  console.log('\n--- 5. 테이블 관리 ---');

  const tables = await request(FE_URL, 'GET', '/api/tables', undefined, adminToken);
  log(`테이블 목록 (${tables.data.data?.length}개)`, tables);

  // 이용 완료
  const complete = await request(FE_URL, 'POST', '/api/tables/3/complete', undefined, adminToken);
  log('테이블 3 이용 완료', complete);

  // 과거 내역
  const history = await request(FE_URL, 'GET', '/api/tables/3/history', undefined, adminToken);
  log(`과거 내역 (${history.data.data?.length}개)`, history);

  // ============================================
  // 6. SSE 연결 테스트 (간단 확인)
  // ============================================
  console.log('\n--- 6. SSE 연결 확인 ---');

  try {
    const sseRes = await fetch(`${FE_URL}/api/sse/orders`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    log(`SSE 연결 (Content-Type: ${sseRes.headers.get('content-type')})`, { status: sseRes.status, data: { success: sseRes.status === 200 } });
    // SSE는 long-lived이므로 바로 abort
    const reader = sseRes.body?.getReader();
    if (reader) {
      const { value } = await reader.read();
      const text = new TextDecoder().decode(value);
      const hasConnected = text.includes('connected');
      console.log(`   → 초기 이벤트 수신: ${hasConnected ? '✅ connected' : '❌ 없음'}`);
      reader.cancel();
    }
  } catch (e: any) {
    console.log(`❌ SSE 연결 실패: ${e.message}`);
  }

  console.log('\n=== 연동 테스트 완료 ===');
}

runTests().catch(console.error);
