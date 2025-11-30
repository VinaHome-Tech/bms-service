import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProvinceOrmEntity } from "./ProvinceOrmEntity";
import { WardOrmEntity } from "./WardOrmEntity";

@Entity('tbl_global_point')
export class GlobalPointOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;
    @Column({ type: 'varchar', length: 255, nullable: false })
    short_name: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    code: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    // --- FK: Province ---
    @Column({ type: 'bigint' })
    province_id: string;

    @ManyToOne(() => ProvinceOrmEntity)
    @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
    province: ProvinceOrmEntity;

    // --- FK: Ward ---
    @Column({ type: 'bigint' })
    ward_id: string;

    @ManyToOne(() => WardOrmEntity)
    @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
    ward: WardOrmEntity;
}