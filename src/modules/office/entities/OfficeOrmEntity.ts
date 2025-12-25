import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { OfficePhoneOrmEntity } from "./OfficePhoneOrmEntity";


@Entity({ name: 'tbl_office' })
@Unique('uq_office_company_name', ['company_id', 'name'])
@Unique('uq_office_company_code', ['company_id', 'code'])
@Index('idx_office_company_id', ['company_id'])
export class OfficeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'uuid' })
  company_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => OfficePhoneOrmEntity, phone => phone.office, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  phones: OfficePhoneOrmEntity[];
}
