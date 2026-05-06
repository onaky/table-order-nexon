import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from './Admin';
import { Table } from './Table';
import { Category } from './Category';
import { Ingredient } from './Ingredient';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  storeId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Admin, (admin) => admin.store)
  admins!: Admin[];

  @OneToMany(() => Table, (table) => table.store)
  tables!: Table[];

  @OneToMany(() => Category, (category) => category.store)
  categories!: Category[];

  @OneToMany(() => Ingredient, (ingredient) => ingredient.store)
  ingredients!: Ingredient[];
}
