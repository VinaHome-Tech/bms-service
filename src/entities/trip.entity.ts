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
import { TripTicketSummary } from '../modules/trip/trip_ticket_summary';
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

  @ManyToOne(() => SeatChart, (seatChart) => seatChart.trips, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;

  @ManyToOne(() => Route, (route) => route.trips, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Schedule, (schedule) => schedule.trips, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @OneToOne(() => TripTicketSummary, (summary) => summary.trip)
  ticket_summary: TripTicketSummary;
}
