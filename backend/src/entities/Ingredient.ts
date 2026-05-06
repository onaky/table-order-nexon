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
import { Store } from './Store';
import { MenuIngredient } from './MenuIngredient';

@Entity('ingredients')
@Index(['storeId'])
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'int', nullable: true })
  calories!: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  flavor!: string | null;

  @Column({ type: 'boolean', default: false })
  isVegan!: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  allergyInfo!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Store, (store) => store.ingredients)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'storeId' })
  store!: Store;

  @OneToMany(() => MenuIngredient, (mi) => mi.ingredient)
  menuIngredients!: MenuIngredient[];
}
