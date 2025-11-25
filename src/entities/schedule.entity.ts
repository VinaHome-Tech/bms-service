import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SeatChart } from './seat_chart.entity';
import { Route } from './route.entity';

@Entity('tbl_schedule')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: false })
  start_date: Date; // Ngày bắt đầu lịch chạy

  @Column({ type: 'date', nullable: true })
  end_date: Date; // Ngày kết thúc lịch chạy

  @Column({ type: 'text', array: true })
  weekdays: string[]; // Ngày trong tuần ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  @Column({ type: 'time', nullable: false })
  start_time: string; // Giờ bắt đầu lịch chạy

  @Column({ type: 'varchar', nullable: false, length: 50 })
  repeat_type: string; // Kiểu lặp lại ('weekday', 'odd_even') - lặp lại theo ngày trong tuần hoặc theo ngày lẻ/chẵn

  @Column({ type: 'varchar', nullable: true, length: 50 })
  odd_even_type: string; // Kiểu lặp lại ngày lẻ/chẵn ('odd' hoặc 'even')

  @Column({ type: 'boolean', nullable: false })
  is_known_end_date: boolean; // Có biết ngày kết thúc lịch chạy hay không

  @Column({ type: 'int', nullable: false })
  trip_type: number; // Loại chuyến đi (1: Chuyến cố định chở khách, 2: Chuyến cố định chở hàng, 3: Xe hợp đồng)

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'uuid', nullable: false })
  company_id: string;

   // Route
  @Column({ type: 'uuid', nullable: false })
  route_id: string;

  @ManyToOne(() => Route, route => route.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  // Seat chart
  @Column({ type: 'uuid', nullable: true })
  seat_chart_id: string;

  @ManyToOne(() => SeatChart, sc => sc.schedules, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;
}
