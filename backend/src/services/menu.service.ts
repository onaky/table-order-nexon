import { AppDataSource } from '../config/database';
import { Menu, MenuIngredient } from '../entities';
import { CreateMenuDto, UpdateMenuDto } from '../types';
import { UploadService } from './upload.service';

export class MenuService {
  private menuRepo = AppDataSource.getRepository(Menu);
  private uploadService = new UploadService();

  /**
   * 매장별 메뉴 조회 (카테고리 필터 가능, sortOrder ASC)
   */
  async findAll(storeId: string, categoryId?: number): Promise<Menu[]> {
    const where: any = { storeId };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.menuRepo.find({
      where,
      order: { sortOrder: 'ASC' },
      relations: ['category'],
    });
  }

  /**
   * 메뉴 상세 조회 (재료 정보 포함)
   */
  async findById(id: number, storeId?: string): Promise<Menu> {
    const where: any = { id };
    if (storeId) where.storeId = storeId;

    const menu = await this.menuRepo.findOne({
      where,
      relations: ['category', 'menuIngredients', 'menuIngredients.ingredient'],
    });

    if (!menu) {
      throw Object.assign(new Error('메뉴를 찾을 수 없습니다'), { statusCode: 404 });
    }

    return menu;
  }

  /**
   * 메뉴 생성
   */
  async create(storeId: string, data: CreateMenuDto): Promise<Menu> {
    // 가격 검증
    if (data.price < 0 || data.price > 1000000) {
      throw Object.assign(new Error('가격은 0 이상 1,000,000 이하여야 합니다'), { statusCode: 400 });
    }

    // sortOrder 자동 할당 (해당 카테고리의 마지막 + 1)
    const maxOrder = await this.menuRepo
      .createQueryBuilder('m')
      .where('m.storeId = :storeId AND m.categoryId = :categoryId', {
        storeId,
        categoryId: data.categoryId,
      })
      .select('MAX(m.sortOrder)', 'max')
      .getRawOne();

    const sortOrder = (maxOrder?.max ?? -1) + 1;

    const menu = this.menuRepo.create({
      storeId,
      categoryId: data.categoryId,
      name: data.name,
      price: data.price,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      sortOrder,
    });

    return this.menuRepo.save(menu);
  }

  /**
   * 메뉴 수정
   */
  async update(id: number, storeId: string, data: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepo.findOne({ where: { id, storeId } });

    if (!menu) {
      throw Object.assign(new Error('메뉴를 찾을 수 없습니다'), { statusCode: 404 });
    }

    // 가격 검증
    if (data.price !== undefined && (data.price < 0 || data.price > 1000000)) {
      throw Object.assign(new Error('가격은 0 이상 1,000,000 이하여야 합니다'), { statusCode: 400 });
    }

    // 이미지 변경 시 이전 이미지 삭제
    if (data.imageUrl !== undefined && menu.imageUrl && data.imageUrl !== menu.imageUrl) {
      await this.uploadService.deleteImage(menu.imageUrl);
    }

    if (data.name !== undefined) menu.name = data.name;
    if (data.price !== undefined) menu.price = data.price;
    if (data.description !== undefined) menu.description = data.description || null;
    if (data.categoryId !== undefined) menu.categoryId = data.categoryId;
    if (data.imageUrl !== undefined) menu.imageUrl = data.imageUrl || null;
    if (data.isAvailable !== undefined) menu.isAvailable = data.isAvailable;

    return this.menuRepo.save(menu);
  }

  /**
   * 메뉴 삭제
   * - 연결된 MenuIngredient CASCADE 삭제
   * - 이미지 파일 삭제
   */
  async delete(id: number, storeId: string): Promise<void> {
    const menu = await this.menuRepo.findOne({ where: { id, storeId } });

    if (!menu) {
      throw Object.assign(new Error('메뉴를 찾을 수 없습니다'), { statusCode: 404 });
    }

    // 이미지 파일 삭제
    if (menu.imageUrl) {
      await this.uploadService.deleteImage(menu.imageUrl);
    }

    await this.menuRepo.remove(menu);
  }

  /**
   * 메뉴 순서 변경
   * - menuIds 배열 순서대로 sortOrder 재할당 (0, 1, 2, ...)
   */
  async reorder(storeId: string, menuIds: number[]): Promise<void> {
    // 모든 메뉴가 동일 매장인지 확인
    const menus = await this.menuRepo.findByIds(menuIds);
    const invalidMenus = menus.filter((m) => m.storeId !== storeId);

    if (invalidMenus.length > 0 || menus.length !== menuIds.length) {
      throw Object.assign(new Error('잘못된 메뉴 목록입니다'), { statusCode: 400 });
    }

    // 트랜잭션으로 sortOrder 일괄 업데이트
    await AppDataSource.transaction(async (manager) => {
      for (let i = 0; i < menuIds.length; i++) {
        await manager.update(Menu, { id: menuIds[i] }, { sortOrder: i });
      }
    });
  }
}
