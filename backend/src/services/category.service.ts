import { AppDataSource } from '../config/database';
import { Category } from '../entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../types';

export class CategoryService {
  private categoryRepo = AppDataSource.getRepository(Category);

  /**
   * 매장별 카테고리 전체 조회 (sortOrder ASC)
   */
  async findAll(storeId: string): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { storeId },
      order: { sortOrder: 'ASC' },
    });
  }

  /**
   * 카테고리 생성
   */
  async create(storeId: string, data: CreateCategoryDto): Promise<Category> {
    // sortOrder 자동 할당 (마지막 + 1)
    const maxOrder = await this.categoryRepo
      .createQueryBuilder('c')
      .where('c.storeId = :storeId', { storeId })
      .select('MAX(c.sortOrder)', 'max')
      .getRawOne();

    const sortOrder = data.sortOrder ?? (maxOrder?.max ?? -1) + 1;

    const category = this.categoryRepo.create({
      storeId,
      name: data.name,
      sortOrder,
    });

    return this.categoryRepo.save(category);
  }

  /**
   * 카테고리 수정
   */
  async update(id: number, storeId: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id, storeId },
    });

    if (!category) {
      throw Object.assign(new Error('카테고리를 찾을 수 없습니다'), { statusCode: 404 });
    }

    if (data.name !== undefined) category.name = data.name;
    if (data.sortOrder !== undefined) category.sortOrder = data.sortOrder;

    return this.categoryRepo.save(category);
  }

  /**
   * 카테고리 삭제
   * - 해당 카테고리에 메뉴가 있으면 삭제 불가 (RESTRICT)
   */
  async delete(id: number, storeId: string): Promise<void> {
    const category = await this.categoryRepo.findOne({
      where: { id, storeId },
      relations: ['menus'],
    });

    if (!category) {
      throw Object.assign(new Error('카테고리를 찾을 수 없습니다'), { statusCode: 404 });
    }

    if (category.menus && category.menus.length > 0) {
      throw Object.assign(
        new Error('해당 카테고리에 메뉴가 존재합니다. 메뉴를 먼저 이동하거나 삭제해주세요'),
        { statusCode: 400 }
      );
    }

    await this.categoryRepo.remove(category);
  }
}
