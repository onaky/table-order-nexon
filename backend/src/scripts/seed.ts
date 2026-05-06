import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database';
import { Store, Admin, Table, Category, Menu, Ingredient, MenuIngredient } from '../entities';

const SALT_ROUNDS = 10;

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // 기존 데이터 정리 (개발용)
    await AppDataSource.synchronize(true);
    console.log('🗑️  Database cleared and synced');

    // ============================================
    // Store 생성
    // ============================================
    const storeRepo = AppDataSource.getRepository(Store);
    const store = await storeRepo.save(
      storeRepo.create({ storeId: 'STORE01', name: '넥슨 카페' })
    );
    console.log('🏪 Store created:', store.name);

    // ============================================
    // Admin 생성
    // ============================================
    const adminRepo = AppDataSource.getRepository(Admin);
    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    const admin = await adminRepo.save(
      adminRepo.create({
        storeId: 'STORE01',
        username: 'admin',
        password: hashedPassword,
      })
    );
    console.log('👤 Admin created:', admin.username);

    // ============================================
    // Table 생성 (5개 테이블)
    // ============================================
    const tableRepo = AppDataSource.getRepository(Table);
    const tablePassword = await bcrypt.hash('1234', SALT_ROUNDS);

    for (let i = 1; i <= 5; i++) {
      await tableRepo.save(
        tableRepo.create({
          storeId: 'STORE01',
          tableNo: i,
          password: tablePassword,
          isActive: true,
        })
      );
    }
    console.log('🪑 Tables created: 1~5');

    // ============================================
    // Category 생성
    // ============================================
    const categoryRepo = AppDataSource.getRepository(Category);
    const categories = await categoryRepo.save([
      categoryRepo.create({ storeId: 'STORE01', name: '메인 메뉴', sortOrder: 0 }),
      categoryRepo.create({ storeId: 'STORE01', name: '사이드', sortOrder: 1 }),
      categoryRepo.create({ storeId: 'STORE01', name: '음료', sortOrder: 2 }),
      categoryRepo.create({ storeId: 'STORE01', name: '디저트', sortOrder: 3 }),
    ]);
    console.log('📂 Categories created:', categories.map((c) => c.name).join(', '));

    // ============================================
    // Menu 생성
    // ============================================
    const menuRepo = AppDataSource.getRepository(Menu);
    const menus = await menuRepo.save([
      // 메인 메뉴
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[0].id, name: '시그니처 버거', price: 15000, description: '프리미엄 수제 버거. 100% 한우 패티와 신선한 채소의 조화', sortOrder: 0 }),
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[0].id, name: '트러플 파스타', price: 18000, description: '블랙 트러플 오일과 파르메산 치즈의 크리미한 파스타', sortOrder: 1 }),
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[0].id, name: '연어 포케볼', price: 16000, description: '신선한 연어와 아보카도, 현미밥의 건강한 한 그릇', sortOrder: 2 }),
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[0].id, name: '스테이크 플레이트', price: 28000, description: '미디엄 레어로 구운 안심 스테이크와 구운 채소', sortOrder: 3 }),
      // 사이드
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[1].id, name: '트러플 감자튀김', price: 8000, description: '트러플 오일과 파르메산 치즈를 뿌린 바삭한 감자튀김', sortOrder: 0 }),
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[1].id, name: '시저 샐러드', price: 9000, description: '로메인 상추, 크루통, 시저 드레싱', sortOrder: 1 }),
      // 음료
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[2].id, name: '수제 레모네이드', price: 6000, description: '신선한 레몬과 허브로 만든 시원한 레모네이드', sortOrder: 0 }),
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[2].id, name: '아이스 아메리카노', price: 5000, description: '에스프레소 더블샷의 깔끔한 아메리카노', sortOrder: 1 }),
      // 디저트
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[3].id, name: '티라미수', price: 8000, description: '마스카포네 치즈와 에스프레소의 클래식 이탈리안 디저트', sortOrder: 0 }),
      menuRepo.create({ storeId: 'STORE01', categoryId: categories[3].id, name: '크렘 브륄레', price: 9000, description: '바닐라 커스터드 위 캐러멜라이즈드 슈가', sortOrder: 1 }),
    ]);
    console.log('🍽️  Menus created:', menus.length, 'items');

    // ============================================
    // Ingredient 생성
    // ============================================
    const ingredientRepo = AppDataSource.getRepository(Ingredient);
    const ingredients = await ingredientRepo.save([
      ingredientRepo.create({ storeId: 'STORE01', name: '한우 패티', calories: 250, flavor: '감칠맛', isVegan: false }),
      ingredientRepo.create({ storeId: 'STORE01', name: '로메인 상추', calories: 15, flavor: '신맛', isVegan: true }),
      ingredientRepo.create({ storeId: 'STORE01', name: '체다 치즈', calories: 110, flavor: '짠맛', isVegan: false }),
      ingredientRepo.create({ storeId: 'STORE01', name: '블랙 트러플 오일', calories: 40, flavor: '감칠맛', isVegan: true }),
      ingredientRepo.create({ storeId: 'STORE01', name: '파르메산 치즈', calories: 120, flavor: '짠맛', isVegan: false }),
      ingredientRepo.create({ storeId: 'STORE01', name: '연어', calories: 180, flavor: '감칠맛', isVegan: false }),
      ingredientRepo.create({ storeId: 'STORE01', name: '아보카도', calories: 160, flavor: '단맛', isVegan: true }),
      ingredientRepo.create({ storeId: 'STORE01', name: '레몬', calories: 20, flavor: '신맛', isVegan: true }),
    ]);
    console.log('🥬 Ingredients created:', ingredients.length, 'items');

    // ============================================
    // MenuIngredient 연결
    // ============================================
    const miRepo = AppDataSource.getRepository(MenuIngredient);
    await miRepo.save([
      // 시그니처 버거 재료
      miRepo.create({ menuId: menus[0].id, ingredientId: ingredients[0].id, sortOrder: 0 }),
      miRepo.create({ menuId: menus[0].id, ingredientId: ingredients[1].id, sortOrder: 1 }),
      miRepo.create({ menuId: menus[0].id, ingredientId: ingredients[2].id, sortOrder: 2 }),
      // 트러플 파스타 재료
      miRepo.create({ menuId: menus[1].id, ingredientId: ingredients[3].id, sortOrder: 0 }),
      miRepo.create({ menuId: menus[1].id, ingredientId: ingredients[4].id, sortOrder: 1 }),
      // 연어 포케볼 재료
      miRepo.create({ menuId: menus[2].id, ingredientId: ingredients[5].id, sortOrder: 0 }),
      miRepo.create({ menuId: menus[2].id, ingredientId: ingredients[6].id, sortOrder: 1 }),
      // 수제 레모네이드 재료
      miRepo.create({ menuId: menus[6].id, ingredientId: ingredients[7].id, sortOrder: 0 }),
    ]);
    console.log('🔗 Menu-Ingredient links created');

    // ============================================
    console.log('\n✅ Seed completed successfully!');
    console.log('📋 Summary:');
    console.log('   - Store: STORE01 (넥슨 카페)');
    console.log('   - Admin: admin / admin123');
    console.log('   - Tables: 1~5 (password: 1234)');
    console.log('   - Categories: 4');
    console.log('   - Menus: 10');
    console.log('   - Ingredients: 8');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
