import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ward } from './wards.entity';

@Entity('tbl_province')
export class Province {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'bigint', unique: true, nullable: false })
  code: number;

  @OneToMany(() => Ward, ward => ward.province)
  wards: Ward[];
}

