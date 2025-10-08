import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from './trip.entity';

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

  @Column()
  company_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips: Trip[];
}
