import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Province } from "./provinces.entity";

@Entity('tbl_ward')
export class Ward {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: false })
  code: number;

  @Column({ type: 'bigint', nullable: false })
  province_code: number;

  @ManyToOne(() => Province, province => province.wards)
  @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
  province: Province;
}
