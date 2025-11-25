import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Office } from './office.entity';

@Entity('tbl_office_phone')
export class OfficePhone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  type: string;

  @ManyToOne(() => Office, (office) => office.phones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'office_id' })
  office: Office;
}
