import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Office } from '../office/office.entity';
import { Route } from '../route/route.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Trip } from '../trip/trip.entity';
import { Vehicle } from '../vehicle/vehicle.entity';

@Entity('tbl_company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  tax_code: string;

  @Column()
  url_image: string;

  @Column()
  code: string;

  @Column()
  note: string;

  @Column()
  status: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  // @OneToMany(() => Office, (office) => office.company)
  // offices: Office[];

  // @OneToMany(() => Route, (route) => route.company)
  // routes: Route[];

  // @OneToMany(() => SeatChart, (seatChart) => seatChart.company)
  // seat_charts: SeatChart[];

  // @OneToMany(() => Schedule, (schedule) => schedule.company)
  // schedules: Schedule[];

  // @OneToMany(() => Trip, (trip) => trip.company, {
  //   onDelete: 'CASCADE',
  // })
  // trips: Trip[];

  // @OneToMany(() => Ticket, (ticket) => ticket.company, {
  //   onDelete: 'CASCADE',
  // })
  // tickets: Ticket[];
}
