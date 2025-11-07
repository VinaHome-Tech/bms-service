import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfficePhone } from './office_phone.entity';


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

<<<<<<< HEAD
  @OneToMany(() => OfficePhone, (phone) => phone.office)
=======
  @OneToMany(() => OfficePhone, (phone) => phone.office, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
>>>>>>> 3df7e614315e41b4f7d13a8329a4a68a4afe3ca0
  phones: OfficePhone[];
}
