/**
 * 추가 API 테스트 스크립트
 * 업로드, 재료 관리, 메뉴 CRUD, 주문 삭제, 테이블 이용완료, 과거 내역 조회
 * 실행: npx ts-node src/scripts/api-test-extended.ts
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
  console.log('=== 추가 API 테스트 시작 ===\n');

  // 로그인
  const adminLogin = await request('POST', '/auth/admin/login', {
    storeId: 'STORE01', username: 'admin', password: 'admin123'
  });
  const adminToken = adminLogin.data.data?.token;

  const tableLogin = await request('POST', '/auth/table/login', {
    storeId: 'STORE01', tableNo: 2, password: '1234'
  });
  const tableToken = tableLogin.data.data?.token;

  // ============================================
  // 1. 카테고리 CRUD
  // ============================================
  console.log('--- 1. 카테고리 CRUD ---');

  const createCat = await request('POST', '/categories', { name: '신메뉴' }, adminToken);
  log('카테고리 생성', createCat);
  const catId = createCat.data.data?.id;

  const updateCat = await request('PUT', `/categories/${catId}`, { name: '시즌 한정' }, adminToken);
  log('카테고리 수정', updateCat);

  const deleteCat = await request('DELETE', `/categories/${catId}`, undefined, adminToken);
  log('카테고리 삭제 (메뉴 없음)', deleteCat);

  // 메뉴가 있는 카테고리 삭제 시도
  const deleteUsedCat = await request('DELETE', '/categories/1', undefined, adminToken);
  log('카테고리 삭제 실패 (메뉴 존재, 400 예상)', deleteUsedCat);

  // ============================================
  // 2. 메뉴 CRUD
  // ============================================
  console.log('\n--- 2. 메뉴 CRUD ---');

  const createMenu = await request('POST', '/menus', {
    name: '테스트 메뉴',
    price: 12000,
    description: '테스트용 메뉴입니다',
    categoryId: 1,
  }, adminToken);
  log('메뉴 생성', createMenu);
  const menuId = createMenu.data.data?.id;

  const updateMenu = await request('PUT', `/menus/${menuId}`, {
    name: '수정된 메뉴',
    price: 15000,
  }, adminToken);
  log('메뉴 수정', updateMenu);

  // 가격 범위 검증
  const badPrice = await request('POST', '/menus', {
    name: '비싼 메뉴',
    price: 2000000,
    categoryId: 1,
  }, adminToken);
  log('메뉴 생성 실패 (가격 초과, 400 예상)', badPrice);

  // 필수 필드 누락
  const noName = await request('POST', '/menus', {
    price: 5000,
    categoryId: 1,
  }, adminToken);
  log('메뉴 생성 실패 (이름 누락, 400 예상)', noName);

  // 메뉴 순서 변경
  const reorder = await request('PUT', '/menus/reorder', {
    menuIds: [3, 1, 2, 4],
  }, adminToken);
  log('메뉴 순서 변경', reorder);

  // 메뉴 삭제
  const deleteMenu = await request('DELETE', `/menus/${menuId}`, undefined, adminToken);
  log('메뉴 삭제', deleteMenu);

  // ============================================
  // 3. 재료 CRUD + 메뉴 연결
  // ============================================
  console.log('\n--- 3. 재료 관리 ---');

  const createIng = await request('POST', '/ingredients', {
    name: '바질',
    calories: 5,
    flavor: '감칠맛',
    isVegan: true,
  }, adminToken);
  log('재료 생성', createIng);
  const ingId = createIng.data.data?.id;

  const updateIng = await request('PUT', `/ingredients/${ingId}`, {
    name: '프레시 바질',
    calories: 3,
  }, adminToken);
  log('재료 수정', updateIng);

  // 메뉴에 재료 연결
  const linkIng = await request('POST', `/menus/1/ingredients/${ingId}`, undefined, adminToken);
  log('메뉴에 재료 연결', linkIng);

  // 중복 연결 시도
  const dupLink = await request('POST', `/menus/1/ingredients/${ingId}`, undefined, adminToken);
  log('중복 연결 (409 예상)', dupLink);

  // 메뉴 재료 조회
  const menuIngs = await request('GET', '/menus/1/ingredients', undefined, tableToken);
  log(`메뉴 재료 조회 (${menuIngs.data.data?.length}개)`, menuIngs);

  // 재료 연결 해제
  const unlinkIng = await request('DELETE', `/menus/1/ingredients/${ingId}`, undefined, adminToken);
  log('재료 연결 해제', unlinkIng);

  // 재료 삭제
  const deleteIng = await request('DELETE', `/ingredients/${ingId}`, undefined, adminToken);
  log('재료 삭제', deleteIng);

  // ============================================
  // 4. 주문 삭제
  // ============================================
  console.log('\n--- 4. 주문 삭제 ---');

  // 주문 생성
  const order = await request('POST', '/orders', {
    items: [{ menuId: 2, quantity: 1 }]
  }, tableToken);
  log('주문 생성 (삭제 테스트용)', order);
  const delOrderId = order.data.data?.id;

  // 관리자가 주문 삭제
  const deleteOrder = await request('DELETE', `/orders/${delOrderId}`, undefined, adminToken);
  log('주문 삭제 (관리자)', deleteOrder);

  // 삭제된 주문 상태 변경 시도
  const ghostOrder = await request('PUT', `/orders/${delOrderId}/status`, { status: 'preparing' }, adminToken);
  log('삭제된 주문 상태 변경 (404 예상)', ghostOrder);

  // ============================================
  // 5. 테이블 설정
  // ============================================
  console.log('\n--- 5. 테이블 설정 ---');

  const setupTable = await request('POST', '/tables/setup', {
    tableNo: 10,
    password: '9999',
  }, adminToken);
  log('새 테이블 설정 (10번)', setupTable);

  // 비밀번호 너무 짧음
  const shortPw = await request('POST', '/tables/setup', {
    tableNo: 11,
    password: '12',
  }, adminToken);
  log('테이블 설정 실패 (비밀번호 짧음, 400 예상)', shortPw);

  // ============================================
  // 6. 테이블 이용 완료 + 과거 내역
  // ============================================
  console.log('\n--- 6. 테이블 이용 완료 ---');

  // 테이블 2에 주문 생성
  const order2 = await request('POST', '/orders', {
    items: [{ menuId: 5, quantity: 3 }, { menuId: 7, quantity: 2 }]
  }, tableToken);
  log('주문 생성 (이용완료 테스트용)', order2);

  // 테이블 2의 세션 조회
  const session = await request('GET', '/tables/2/session', undefined, adminToken);
  log('테이블 2 세션 조회', session);

  // 테이블 2 이용 완료
  const complete = await request('POST', '/tables/2/complete', undefined, adminToken);
  log('테이블 2 이용 완료', complete);

  // 이용 완료 후 주문 조회 (비어있어야 함)
  const tableLogin2 = await request('POST', '/auth/table/login', {
    storeId: 'STORE01', tableNo: 2, password: '1234'
  });
  const tableToken2 = tableLogin2.data.data?.token;
  const ordersAfter = await request('GET', '/orders', undefined, tableToken2);
  log(`이용완료 후 주문 조회 (${ordersAfter.data.data?.length}개, 0 예상)`, ordersAfter);

  // 과거 내역 조회
  const history = await request('GET', '/tables/2/history', undefined, adminToken);
  log(`과거 내역 조회 (${history.data.data?.length}개)`, history);

  // ============================================
  // 7. 권한 테스트
  // ============================================
  console.log('\n--- 7. 권한 테스트 ---');

  // 테이블 토큰으로 관리자 전용 API 접근
  const tableAsAdmin = await request('POST', '/menus', {
    name: '해킹', price: 1, categoryId: 1
  }, tableToken2);
  log('테이블이 메뉴 생성 시도 (403 예상)', tableAsAdmin);

  const tableDeleteOrder = await request('DELETE', '/orders/1', undefined, tableToken2);
  log('테이블이 주문 삭제 시도 (403 예상)', tableDeleteOrder);

  // 토큰 검증
  const verifyValid = await request('POST', '/auth/verify', { token: adminToken });
  log('유효한 토큰 검증', verifyValid);

  const verifyInvalid = await request('POST', '/auth/verify', { token: 'invalid.token.here' });
  log('잘못된 토큰 검증 (에러 예상)', verifyInvalid);

  console.log('\n=== 추가 테스트 완료 ===');
}

runTests().catch(console.error);
