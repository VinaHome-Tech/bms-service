import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Office } from './office.entity';

@Entity('tbl_office_phone_2')
export class OfficePhone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  @Column({ type: 'uuid', nullable: false })
  office_id: string;

  @ManyToOne(() => Office, (office) => office.phones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'office_id' })
  office: Office;
}

