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
import { Menu } from './Menu';

@Entity('categories')
@Index(['storeId', 'sortOrder'])
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Store, (store) => store.categories)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'storeId' })
  store!: Store;

  @OneToMany(() => Menu, (menu) => menu.category)
  menus!: Menu[];
}
