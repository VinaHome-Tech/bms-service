import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_vehicle')
export class VehicleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  license_plate: string;   // Biển số xe

  @Column({ type: 'varchar', length: 100, nullable: true })
  engine_number: string;   // Số máy

  @Column({ type: 'varchar', length: 100, nullable: true })
  frame_number: string;    // Số khung

  @Column({ type: 'int', nullable: false })
  status: number;      

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;        // Màu xe

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;          // Hãng xe

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;           // phone liên hệ 

  @Column({ type: 'date', nullable: true })
  registration_expiry: Date; // Ngày hết hạn đăng kiểm

  @Column({ type: 'date', nullable: true })
  maintenance_due: Date;     // Ngày bảo dưỡng kế tiếp

  @Column({ type: 'uuid', nullable: false })
  company_id: string;


  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}