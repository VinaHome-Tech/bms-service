import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Route } from '../route/route.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Vehicle } from '../vehicle/vehicle.entity';

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

  @Column('jsonb', { nullable: true })
  driver: Array<{
    id: string;
    full_name: string;
    number_phone: string;
  }>[];
  @Column('jsonb', { nullable: true })
  assistant: Array<{
    id: string;
    full_name: string;
    number_phone: string;
  }>[];

  @ManyToOne(() => SeatChart, (seatChart) => seatChart.trips, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'seat_chart_id' })
  seat_chart: SeatChart;

  @ManyToOne(() => Company, (company) => company.trips, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Route, (route) => route.trips, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @OneToMany(() => Ticket, (ticket) => ticket.trip, {
    onDelete: 'CASCADE',
    eager: true,
  })
  tickets: Ticket[];

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;
}
