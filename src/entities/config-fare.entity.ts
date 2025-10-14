import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FareConfig } from "./fare-config.entity";
import { Route } from "./route.entity";

@Entity({ name: 'tbl_config_fare' })
export class ConfigFare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  route_id: number;

  @ManyToOne(() => Route, (route) => route.configFares, {
    onDelete: 'CASCADE', // Xoá route thì xoá luôn config liên quan
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column()
  trip_type: number;

  @Column({ type: 'jsonb', nullable: true })
  seat_chart_id: number[];

  @Column({ default: false })
  priority: boolean;

  @Column({ default: false })
  double_room: boolean;

  @Column({ default: false })
  same_price: boolean;

  @Column({ nullable: true })
  company_id: string;

  @Column({ nullable: true })
  config_name: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @OneToMany(() => FareConfig, (fareConfig) => fareConfig.configFare, {
    cascade: true, // tự động lưu fare_configs khi lưu ConfigFare
    eager: true,   // load luôn fare_configs khi query ConfigFare
  })
  fare_configs: FareConfig[];
}