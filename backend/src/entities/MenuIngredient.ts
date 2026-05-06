import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Menu } from './Menu';
import { Ingredient } from './Ingredient';

@Entity('menu_ingredients')
@Unique(['menuId', 'ingredientId'])
@Index(['menuId'])
@Index(['ingredientId'])
export class MenuIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  menuId!: number;

  @Column({ type: 'int' })
  ingredientId!: number;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Menu, (menu) => menu.menuIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu!: Menu;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.menuIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient;
}
