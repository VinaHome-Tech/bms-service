import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConfigFare } from './config-fare.entity';

@Entity('tbl_fare_config')
export class FareConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  departure_point_id: number[];

  @Column({ type: 'jsonb', nullable: true })
  arrival_point_id: number[];

  @Column({ default: 0 })
  single_room_price: number;

  @Column({ default: 0 })
  double_room_price: number;

  @Column()
  config_fare_id: number;

  @ManyToOne(() => ConfigFare, (configFare) => configFare.fare_configs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'config_fare_id' })
  configFare: ConfigFare;
}
