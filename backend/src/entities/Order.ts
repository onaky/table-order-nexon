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
import { TableSession } from './TableSession';
import { OrderItem } from './OrderItem';
import { OrderStatus } from '../types';

@Entity('orders')
@Index(['storeId', 'status'])
@Index(['tableId', 'sessionId'])
@Index(['storeId', 'createdAt'])
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  orderNumber!: string;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'int' })
  tableId!: number;

  @Column({ type: 'varchar', length: 36 })
  sessionId!: string;

  @Column({ type: 'varchar', length: 20, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'int' })
  totalAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TableSession, (session) => session.orders)
  @JoinColumn({ name: 'sessionId', referencedColumnName: 'sessionId' })
  session!: TableSession;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];
}
