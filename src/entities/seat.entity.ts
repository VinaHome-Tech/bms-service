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
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;
  @Column({ type: 'boolean', nullable: false })
  status: boolean;
  @Column({ type: 'int', nullable: false })
  floor: number;
  @Column({ type: 'int', nullable: false })
  row: number;
  @Column({ type: 'int', nullable: false })
  column: number;
  @Column({ type: 'uuid', nullable: false })
  seat_chart_id: string;

  @ManyToOne(() => SeatChart, (seatChart) => seatChart.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;
}
