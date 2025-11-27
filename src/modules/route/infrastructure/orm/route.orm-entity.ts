import { Schedule } from "src/entities/schedule.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_route_2')
export class RouteOrmEntity  {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'double precision', nullable: false })
  base_price: number; // Giá vé cơ bản của tuyến
  @Column({ type: 'int', nullable: true })
  distance: number; // Quãng đường của tuyến (km)
  @Column({ type: 'double precision', nullable: false })
  e_ticket_price: number; // Giá vé điện tử
  @Column({ type: 'varchar', length: 255, nullable: true })
  journey: string; // Lộ trình
  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string; // Ghi chú tuyến
  @Column({ type: 'varchar', length: 255, nullable: false })
  route_name: string; // Tên tuyến
  @Column({ type: 'varchar', length: 255, nullable: false })
  route_name_e_ticket: string; // Tên tuyến trên vé điện tử
  @Column({ type: 'varchar', length: 255, nullable: false })
  short_name: string; // Tên rút gọn tuyến
  @Column({ type: 'boolean', nullable: false })
  status: boolean;      // Trạng thái tuyến
  @Column({ type: 'int', nullable: true })
  display_order: number; // Thứ tự hiển thị
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'uuid', nullable: false })
  company_id: string;

//   @OneToMany(() => Schedule, (schedule) => schedule.route)
//   schedule: Schedule[];

  // @OneToMany(() => RoutePoint, (routePoint) => routePoint.route)
  // routePoints: RoutePoint[];
//   @OneToMany(() => ConfigFare, (configFare) => configFare.route)
//   configFares: ConfigFare[];
}