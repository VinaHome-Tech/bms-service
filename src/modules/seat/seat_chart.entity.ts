import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Seat } from './seat.entity';
import { Schedule } from '../schedule/schedule.entity';

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
  created_by: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Company, (company) => company.seat_charts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Seat, (seat) => seat.seat_chart, {
    cascade: true,
  })
  seats: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.seat_chart)
  schedule: Schedule[];
}
