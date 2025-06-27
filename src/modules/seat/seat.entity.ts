import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeatChart } from './seat_chart.entity';

@Entity('tbl_seat')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  code: string;
  @Column()
  name: string;
  @Column()
  status: boolean;
  @Column()
  floor: number;
  @Column()
  row: number;
  @Column()
  column: number;
  @Column()
  type: number; // 1: Ghế đơn, 2: Ghế đôi,

  @ManyToOne(() => SeatChart, (seatChart) => seatChart.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;
}
