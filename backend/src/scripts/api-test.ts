/**
 * 최소 API 테스트 스크립트
 * 서버가 실행 중인 상태에서: npx ts-node src/scripts/api-test.ts
 */

const BASE_URL = 'http://localhost:3000/api';

async function request(method: string, path: string, body?: any, token?: string): Promise<{ status: number; data: any }> {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return { status: res.status, data };
}

function log(label: string, result: { status: number; data: any }) {
  const icon = result.data.success ? '✅' : '❌';
  console.log(`${icon} [${result.status}] ${label}`);
  if (!result.data.success) {
    console.log(`   Error: ${result.data.error}`);
  }
}

async function runTests() {
  console.log('=== Backend API 테스트 시작 ===\n');

  // 1. 관리자 로그인
  console.log('--- 1. 인증 테스트 ---');
  const adminLogin = await request('POST', '/auth/admin/login', {
    storeId: 'STORE01', username: 'admin', password: 'admin123'
  });
  log('관리자 로그인', adminLogin);
  const adminToken = adminLogin.data.data?.token;

  // 2. 테이블 로그인
  const tableLogin = await request('POST', '/auth/table/login', {
    storeId: 'STORE01', tableNo: 1, password: '1234'
  });
  log('테이블 로그인', tableLogin);
  const tableToken = tableLogin.data.data?.token;
  const sessionId = tableLogin.data.data?.session?.sessionId;

  // 3. 잘못된 비밀번호
  const badLogin = await request('POST', '/auth/admin/login', {
    storeId: 'STORE01', username: 'admin', password: 'wrong'
  });
  log('잘못된 비밀번호 (401 예상)', badLogin);

  // 4. 카테고리 조회
  console.log('\n--- 2. 카테고리/메뉴 조회 테스트 ---');
  const categories = await request('GET', '/categories', undefined, adminToken);
  log(`카테고리 조회 (${categories.data.data?.length}개)`, categories);

  // 5. 메뉴 조회
  const menus = await request('GET', '/menus', undefined, tableToken);
  log(`메뉴 전체 조회 (${menus.data.data?.length}개)`, menus);

  // 6. 메뉴 상세 (재료 포함)
  const menuDetail = await request('GET', '/menus/1', undefined, tableToken);
  const ingredientCount = menuDetail.data.data?.menuIngredients?.length ?? 0;
  log(`메뉴 상세 조회 (재료 ${ingredientCount}개)`, menuDetail);

  // 7. 주문 생성
  console.log('\n--- 3. 주문 테스트 ---');
  const createOrder = await request('POST', '/orders', {
    items: [
      { menuId: 1, quantity: 2 },
      { menuId: 3, quantity: 1 },
    ]
  }, tableToken);
  log(`주문 생성 (번호: ${createOrder.data.data?.orderNumber})`, createOrder);
  const orderId = createOrder.data.data?.id;

  // 8. 주문 조회 (고객)
  const myOrders = await request('GET', '/orders', undefined, tableToken);
  log(`내 주문 조회 (${myOrders.data.data?.length}개)`, myOrders);

  // 9. 주문 상태 변경 (관리자)
  console.log('\n--- 4. 주문 상태 변경 테스트 ---');
  const statusPreparing = await request('PUT', `/orders/${orderId}/status`, { status: 'preparing' }, adminToken);
  log(`상태 변경: pending → preparing`, statusPreparing);

  const statusCompleted = await request('PUT', `/orders/${orderId}/status`, { status: 'completed' }, adminToken);
  log(`상태 변경: preparing → completed`, statusCompleted);

  // 10. 잘못된 상태 전이
  const badStatus = await request('PUT', `/orders/${orderId}/status`, { status: 'pending' }, adminToken);
  log('잘못된 상태 전이 (400 예상)', badStatus);

  // 11. 인증 없이 접근
  console.log('\n--- 5. 인증 실패 테스트 ---');
  const noAuth = await request('GET', '/menus');
  log('인증 없이 메뉴 조회 (401 예상)', noAuth);

  // 12. 테이블 관리 (관리자)
  console.log('\n--- 6. 테이블 관리 테스트 ---');
  const tables = await request('GET', '/tables', undefined, adminToken);
  log(`테이블 목록 (${tables.data.data?.length}개)`, tables);

  console.log('\n=== 테스트 완료 ===');
}

runTests().catch(console.error);
