import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WardOrmEntity } from './WardOrmEntity';
import { GlobalPointOrmEntity } from './GlobalPointOrmEntity';

@Entity('tbl_province')
export class ProvinceOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'bigint', unique: true, nullable: false })
  code: string;

  @OneToMany(() => WardOrmEntity, ward => ward.province)
  wards: WardOrmEntity[];

  @OneToMany(() => GlobalPointOrmEntity, global => global.province)
  global_points: GlobalPointOrmEntity[];
}

