import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Trip } from '../trip/trip.entity';

@Entity('tbl_ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_name: string;

  @Column()
  seat_status: boolean;

  @Column()
  seat_floor: number;

  @Column()
  seat_row: number;

  @Column()
  seat_column: number;

  @Column()
  seat_type: number;

  @Column()
  seat_code: string;

  @Column()
  booked_status: boolean;

  @Column()
  ticket_phone: string;

  @Column()
  ticket_email: string;

  @Column()
  ticket_customer_name: string;

  @Column()
  ticket_point_up: string;

  @Column()
  ticket_point_down: string;

  @Column()
  ticket_note: string;

  @Column()
  ticket_display_price: number;

  @Column()
  payment_method: string;

  @Column()
  user_created: string;

  @Column()
  office_created: string;

  @ManyToOne(() => Company, (company) => company.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Trip, (trip) => trip.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;
}
