import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProvinceOrmEntity } from "./ProvinceOrmEntity";
import { GlobalPointOrmEntity } from "./GlobalPointOrmEntity";

@Entity('tbl_ward')
export class WardOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: false })
  code: string;

  @Column({ type: 'bigint', nullable: false })
  province_code: string;

  @ManyToOne(() => ProvinceOrmEntity, province => province.wards)
  @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
  province: ProvinceOrmEntity;

  @OneToMany(() => GlobalPointOrmEntity, global => global.ward)
  global_points: GlobalPointOrmEntity[];
}
