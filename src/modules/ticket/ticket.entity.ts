import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from '../trip/trip.entity';
import { Office } from '../office/office.entity';

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
  user_id_created: string;

  @Column()
  company_id: string;

  @Column()
  contact_status: number;

  @Column()
  transit_up: boolean;

  @Column()
  transit_down: boolean;

  @ManyToOne(() => Trip, (trip) => trip.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => Office, (office) => office.tickets, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'office_id' })
  office: Office;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
