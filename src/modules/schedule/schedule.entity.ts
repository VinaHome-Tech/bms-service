import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Route } from '../route/route.entity';
import { SeatChart } from '../seat/seat_chart.entity';

@Entity('tbl_schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  weekdays: string[];

  @Column()
  start_time: string;

  @Column()
  repeat_type: string;

  @Column()
  odd_even_type: string;

  @Column()
  is_known_end_date: boolean;

  @Column()
  trip_type: number;

  @Column()
  created_by: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Company, (company) => company.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Route, (route) => route.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => SeatChart, (seat_chart) => seat_chart.schedule, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;
}
