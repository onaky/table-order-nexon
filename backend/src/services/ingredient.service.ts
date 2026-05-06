import { AppDataSource } from '../config/database';
import { Ingredient, MenuIngredient } from '../entities';
import { CreateIngredientDto, UpdateIngredientDto } from '../types';
import { UploadService } from './upload.service';

export class IngredientService {
  private ingredientRepo = AppDataSource.getRepository(Ingredient);
  private menuIngredientRepo = AppDataSource.getRepository(MenuIngredient);
  private uploadService = new UploadService();

  /**
   * 매장별 전체 재료 조회
   */
  async findAll(storeId: string): Promise<Ingredient[]> {
    return this.ingredientRepo.find({
      where: { storeId },
      order: { name: 'ASC' },
    });
  }

  /**
   * 메뉴별 재료 조회
   */
  async findByMenu(menuId: number): Promise<Ingredient[]> {
    const menuIngredients = await this.menuIngredientRepo.find({
      where: { menuId },
      relations: ['ingredient'],
      order: { sortOrder: 'ASC' },
    });

    return menuIngredients.map((mi) => mi.ingredient);
  }

  /**
   * 재료 생성
   */
  async create(storeId: string, data: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = this.ingredientRepo.create({
      storeId,
      name: data.name,
      imageUrl: data.imageUrl || null,
      calories: data.calories ?? null,
      flavor: data.flavor || null,
      isVegan: data.isVegan ?? false,
      allergyInfo: data.allergyInfo || null,
    });

    return this.ingredientRepo.save(ingredient);
  }

  /**
   * 재료 수정
   */
  async update(id: number, storeId: string, data: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.ingredientRepo.findOne({ where: { id, storeId } });

    if (!ingredient) {
      throw Object.assign(new Error('재료를 찾을 수 없습니다'), { statusCode: 404 });
    }

    // 이미지 변경 시 이전 이미지 삭제
    if (data.imageUrl !== undefined && ingredient.imageUrl && data.imageUrl !== ingredient.imageUrl) {
      await this.uploadService.deleteImage(ingredient.imageUrl);
    }

    if (data.name !== undefined) ingredient.name = data.name;
    if (data.imageUrl !== undefined) ingredient.imageUrl = data.imageUrl || null;
    if (data.calories !== undefined) ingredient.calories = data.calories ?? null;
    if (data.flavor !== undefined) ingredient.flavor = data.flavor || null;
    if (data.isVegan !== undefined) ingredient.isVegan = data.isVegan;
    if (data.allergyInfo !== undefined) ingredient.allergyInfo = data.allergyInfo || null;

    return this.ingredientRepo.save(ingredient);
  }

  /**
   * 재료 삭제
   * - 연결된 MenuIngredient CASCADE 삭제
   * - 이미지 파일 삭제
   */
  async delete(id: number, storeId: string): Promise<void> {
    const ingredient = await this.ingredientRepo.findOne({ where: { id, storeId } });

    if (!ingredient) {
      throw Object.assign(new Error('재료를 찾을 수 없습니다'), { statusCode: 404 });
    }

    if (ingredient.imageUrl) {
      await this.uploadService.deleteImage(ingredient.imageUrl);
    }

    await this.ingredientRepo.remove(ingredient);
  }

  /**
   * 메뉴에 재료 연결
   */
  async linkToMenu(menuId: number, ingredientId: number, storeId: string): Promise<void> {
    // 재료가 동일 매장인지 확인
    const ingredient = await this.ingredientRepo.findOne({ where: { id: ingredientId, storeId } });
    if (!ingredient) {
      throw Object.assign(new Error('재료를 찾을 수 없습니다'), { statusCode: 404 });
    }

    // 이미 연결 확인
    const existing = await this.menuIngredientRepo.findOne({
      where: { menuId, ingredientId },
    });

    if (existing) {
      throw Object.assign(new Error('이미 연결된 재료입니다'), { statusCode: 409 });
    }

    // sortOrder 자동 할당
    const maxOrder = await this.menuIngredientRepo
      .createQueryBuilder('mi')
      .where('mi.menuId = :menuId', { menuId })
      .select('MAX(mi.sortOrder)', 'max')
      .getRawOne();

    const sortOrder = (maxOrder?.max ?? -1) + 1;

    const menuIngredient = this.menuIngredientRepo.create({
      menuId,
      ingredientId,
      sortOrder,
    });

    await this.menuIngredientRepo.save(menuIngredient);
  }

  /**
   * 메뉴에서 재료 해제
   */
  async unlinkFromMenu(menuId: number, ingredientId: number): Promise<void> {
    const menuIngredient = await this.menuIngredientRepo.findOne({
      where: { menuId, ingredientId },
    });

    if (!menuIngredient) {
      throw Object.assign(new Error('연결된 재료를 찾을 수 없습니다'), { statusCode: 404 });
    }

    await this.menuIngredientRepo.remove(menuIngredient);
  }
}
