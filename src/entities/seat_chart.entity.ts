import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Trip } from './trip.entity';
import { Seat } from './seat.entity';

@Entity('tbl_seat_chart')
export class SeatChart {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  seat_chart_name: string;
  @Column()
  seat_chart_type: number; // 1: Ghế ngồi, 2: Ghế ngồi limousine, 3: Giường nằm, 4: Giường nằm limousine, 5: Phòng VIP (Cabin đơn), 6: Phòng VIP (Cabin đôi)
  @Column()
  total_floor: number;
  @Column()
  total_row: number;
  @Column()
  total_column: number;
  @Column()
  total_seat: number;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @Column()
  company_id: string;

  @OneToMany(() => Seat, (seat) => seat.seat_chart, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  seats: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.seat_chart)
  schedules: Schedule[];

}
