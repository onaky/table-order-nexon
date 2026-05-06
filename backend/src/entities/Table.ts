import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Store } from './Store';
import { TableSession } from './TableSession';

@Entity('tables')
@Unique(['storeId', 'tableNo'])
export class Table {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'int' })
  tableNo!: number;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Store, (store) => store.tables)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'storeId' })
  store!: Store;

  @OneToMany(() => TableSession, (session) => session.table)
  sessions!: TableSession[];
}
