import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './Order';
import { Menu } from './Menu';

@Entity('order_items')
@Index(['orderId'])
@Index(['menuId'])
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  orderId!: number;

  @Column({ type: 'int' })
  menuId!: number;

  @Column({ type: 'varchar', length: 100 })
  menuName!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'int' })
  unitPrice!: number;

  @Column({ type: 'int' })
  subtotal!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Menu, (menu) => menu.orderItems)
  @JoinColumn({ name: 'menuId' })
  menu!: Menu;
}
