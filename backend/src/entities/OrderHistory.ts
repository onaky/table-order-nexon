import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('order_history')
@Index(['storeId', 'tableId', 'completedAt'])
@Index(['storeId', 'completedAt'])
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 30 })
  orderNumber!: string;

  @Column({ type: 'varchar', length: 50 })
  storeId!: string;

  @Column({ type: 'int' })
  tableId!: number;

  @Column({ type: 'int' })
  tableNo!: number;

  @Column({ type: 'varchar', length: 36 })
  sessionId!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: string;

  @Column({ type: 'int' })
  totalAmount!: number;

  @Column({ type: 'json' })
  items!: any;

  @Column({ type: 'datetime' })
  orderedAt!: Date;

  @Column({ type: 'datetime' })
  completedAt!: Date;
}
