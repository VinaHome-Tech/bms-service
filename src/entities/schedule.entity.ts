import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeatChart } from './seat_chart.entity';
import { Route } from './route.entity';

@Entity('tbl_schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_date: Date; // Ngày bắt đầu lịch chạy

  @Column()
  end_date: Date; // Ngày kết thúc lịch chạy

  @Column('text', { array: true })
  weekdays: string[]; // Ngày trong tuần ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  @Column()
  start_time: string; // Giờ bắt đầu lịch chạy

  @Column()
  repeat_type: string; // Kiểu lặp lại ('weekday', 'odd_even') - lặp lại theo ngày trong tuần hoặc theo ngày lẻ/chẵn

  @Column()
  odd_even_type: string; // Kiểu lặp lại ngày lẻ/chẵn ('odd' hoặc 'even')

  @Column()
  is_known_end_date: boolean; // Có biết ngày kết thúc lịch chạy hay không

  @Column()
  trip_type: number; // Loại chuyến đi (1: Chuyến cố định chở khách, 2: Chuyến cố định chở hàng, 3: Xe hợp đồng)

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  company_id: string;

  @ManyToOne(() => Route, (route) => route.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => SeatChart, (seat_chart) => seat_chart.schedules, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;
}
