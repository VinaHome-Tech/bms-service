// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   OneToMany,
// } from 'typeorm';
// import { Province } from './provinces.entity';
// import { Ward } from './wards.entity';
// import { RoutePoint } from './route_point.entity';

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tbl_point')
export class Point {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  short_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'bigint', nullable: false })
  province_code: number;

  @Column({ type: 'bigint', nullable: false })
  ward_code: number;

}
