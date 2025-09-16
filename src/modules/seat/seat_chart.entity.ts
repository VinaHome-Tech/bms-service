import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seat } from './seat.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Trip } from '../trip/trip.entity';

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
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  company_id: string;

  @OneToMany(() => Seat, (seat) => seat.seat_chart, {
    cascade: true,
  })
  seats: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.seat_chart)
  schedule: Schedule[];

  @OneToMany(() => Trip, (trip) => trip.seat_chart)
  trips: Trip[];
}
