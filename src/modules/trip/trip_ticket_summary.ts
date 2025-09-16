import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity('tbl_trip_ticket_summary')
export class TripTicketSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_tickets: number;

  @Column()
  booked_tickets: number;

  @OneToOne(() => Trip, (trip) => trip.ticket_summary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;
}
