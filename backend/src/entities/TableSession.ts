import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Table } from './Table';
import { Order } from './Order';

@Entity('table_sessions')
@Index(['tableId', 'isActive'])
@Index(['storeId', 'isActive'])
export class TableSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 36, unique: true })
  sessionId!: string;

  @Column({ type: 'int' })
  tableId!: number;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt!: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => Table, (table) => table.sessions)
  @JoinColumn({ name: 'tableId' })
  table!: Table;

  @OneToMany(() => Order, (order) => order.session)
  orders!: Order[];
}
