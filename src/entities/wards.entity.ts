import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Province } from "./provinces.entity";
import { Point } from "./point.entity";

@Entity('tbl_wards')
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: number;

  @Column()
  division_type: string;

  @Column()
  codename: string;

  @Column()
  province_code: number;

  @ManyToOne(() => Province, province => province.wards)
  @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
  province: Province;

  @OneToMany(() => Point, (point) => point.ward)
  points: Point[];
}