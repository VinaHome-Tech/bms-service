import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ward } from './wards.entity';
import { Point } from './point.entity';

@Entity('tbl_provinces')
export class Province {
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
  phone_code: number;

  @OneToMany(() => Ward, ward => ward.province)
  wards: Ward[];

  @OneToMany(() => Point, (point) => point.province)
  points: Point[];
}
