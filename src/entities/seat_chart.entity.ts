import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Seat } from './seat.entity';

@Entity('tbl_seat_chart')
export class SeatChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  seat_chart_name: string;
  @Column({ type: 'int', nullable: false })
  seat_chart_type: number; // 1: Ghế ngồi, 2: Ghế ngồi limousine, 3: Giường nằm, 4: Giường nằm limousine, 5: Phòng VIP (Cabin đơn), 6: Phòng VIP (Cabin đôi)
  @Column({ type: 'int', nullable: false })
  total_floor: number;
  @Column({ type: 'int', nullable: false })
  total_row: number;
  @Column({ type: 'int', nullable: false })
  total_column: number;
  @Column({ type: 'int', nullable: false })
  total_seat: number;
  @Column({ type: 'uuid', nullable: false })
  company_id: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Seat, (seat) => seat.seat_chart, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  seats: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.seat_chart)
  schedules: Schedule[];

}
