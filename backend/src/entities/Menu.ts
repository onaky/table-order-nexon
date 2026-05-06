import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Category } from './Category';
import { MenuIngredient } from './MenuIngredient';
import { OrderItem } from './OrderItem';

@Entity('menus')
@Index(['storeId', 'categoryId', 'sortOrder'])
@Index(['categoryId'])
export class Menu {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'int' })
  categoryId!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'boolean', default: true })
  isAvailable!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.menus)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @OneToMany(() => MenuIngredient, (mi) => mi.menu)
  menuIngredients!: MenuIngredient[];

  @OneToMany(() => OrderItem, (item) => item.menu)
  orderItems!: OrderItem[];
}
