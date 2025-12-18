import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OfficeOrmEntity } from "./OfficeOrmEntity";

@Entity('tbl_office_phone')
export class OfficePhoneOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  @ManyToOne(() => OfficeOrmEntity, office => office.phones, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'office_id' })
  office: OfficeOrmEntity;

}