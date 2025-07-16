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
import { Schedule } from '../schedule/schedule.entity';
import { Trip } from '../trip/trip.entity';

@Entity('tbl_route')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  base_price: number;
  @Column()
  distance: number;
  @Column()
  e_ticket_price: number;
  @Column()
  journey: string;
  @Column()
  note: string;
  @Column()
  route_name: string;
  @Column()
  route_name_e_ticket: string;
  @Column()
  short_name: string;
  @Column()
  status: boolean;
  @Column()
  display_order: number;
  @Column()
  created_by: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Company, (company) => company.routes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Schedule, (schedule) => schedule.route)
  schedule: Schedule[];

  @OneToMany(() => Trip, (trip) => trip.route)
  trips: Trip[];
}
