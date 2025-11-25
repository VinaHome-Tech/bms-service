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

// @Entity('tbl_point')
// export class Point {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column()
//   short_name: string;

//   @Column()
//   address: string;

//   @Column()
//   province_code: number;

//   @Column()
//   ward_code: number;

//   @ManyToOne(() => Province, (province) => province.points)
//   @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
//   province: Province;

//   @ManyToOne(() => Ward, (ward) => ward.points)
//   @JoinColumn({ name: 'ward_code', referencedColumnName: 'code' })
//   ward: Ward;

//   @OneToMany(() => RoutePoint, (routePoint) => routePoint.point)
//   routePoints: RoutePoint[];
// }
