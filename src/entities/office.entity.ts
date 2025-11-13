import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfficePhone } from './office_phone.entity';
import { Schedule } from './schedule.entity';


@Entity('tbl_office')
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  address: string;

  @Column()
  note: string;

  @Column()
  status: boolean;

  @Column()
  company_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => OfficePhone, (phone) => phone.office, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  phones: OfficePhone[];

  @OneToMany(() => Schedule, (schedule) => schedule.route, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  schedules: Schedule[];
}
