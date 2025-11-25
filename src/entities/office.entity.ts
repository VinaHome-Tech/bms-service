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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;

  @Column({ type: 'uuid', nullable: false })
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
