import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeatChart } from './seat_chart.entity';
import { Schedule } from './schedule.entity';
import { TripTicketSummary } from './trip_ticket_summary.entity';
import { Route } from './route.entity';
import { Vehicle } from './vehicle.entity';

@Entity('tbl_trip')
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departure_date: Date;

  @Column()
  departure_time: string;

  @Column()
  trip_type: number;

  @Column()
  note: string;

  @Column()
  company_id: string;

  @Column('jsonb', { nullable: true })
  driver: Array<{
    id: string;
    name: string;
    phone: string;
  }>[];
  @Column('jsonb', { nullable: true })
  assistant: Array<{
    id: string;
    name: string;
    phone: string;
  }>[];

  @DeleteDateColumn()
  deleted_at: Date;

  @Column()
  confirmation_depart: boolean;

  @Column()
  ticket_price: number;




  @ManyToOne(() => Schedule, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @OneToOne(() => TripTicketSummary, (summary) => summary.trip)
  ticket_summary: TripTicketSummary;
}
