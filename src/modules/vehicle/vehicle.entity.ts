import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Trip } from '../trip/trip.entity';

@Entity('tbl_vehicle')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  license_plate: string;

  @Column()
  engine_number: string;

  @Column()
  frame_number: string;

  @Column()
  status: number;

  @Column()
  color: string;

  @Column()
  brand: string;

  @Column()
  phone: string;

  @Column()
  registration_expiry: Date;

  @Column()
  maintenance_due: Date;

  @ManyToOne(() => Company, (company) => company.vehicles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips: Trip[];
}
