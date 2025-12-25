import { Injectable } from "@nestjs/common";
import { BmsVehicleRepository } from "./bms-vehicle.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { VehicleOrmEntity } from "../../entities/VehicleOrmEntity";
import { Repository } from "typeorm";

@Injectable()
export class TypeOrmBmsVehicleRepository extends BmsVehicleRepository {
    constructor(
        @InjectRepository(VehicleOrmEntity)
        private readonly repoVehicle: Repository<VehicleOrmEntity>,
    ) {
        super();
    }

    async findOneByCompanyAndLicensePlate(companyId: string, licensePlate: string): Promise<Partial<VehicleOrmEntity>> {
        return this.repoVehicle.findOne({
            where: {
                company_id: companyId,
                license_plate: licensePlate,
            },
            select: {
                id: true,
                license_plate: true,
            },
        });
    }

    async saveVehicle(
        vehicle: VehicleOrmEntity
    ): Promise<VehicleOrmEntity> {
        return this.repoVehicle.save(vehicle);
    }

    async findAllByCompanyId(companyId: string): Promise<VehicleOrmEntity[]> {
        return this.repoVehicle.find({
            select: ['id', 'license_plate', 'brand', 'color', 'engine_number', 'frame_number', 'phone', 'registration_expiry', 'maintenance_due', 'status', 'created_at', 'updated_at'],
            where: {
                company_id: companyId,
            },
            order: {
                created_at: "ASC",
            },
        });
    }

    async findById(vehicleId: string): Promise<VehicleOrmEntity> {
        return this.repoVehicle.findOne({
            select: ['id', 'license_plate', 'brand', 'color', 'engine_number', 'frame_number', 'phone', 'registration_expiry', 'maintenance_due', 'status', 'created_at', 'updated_at'],
            where: {
                id: vehicleId,
            },
        });
    }

    async deleteVehicle(vehicleId: string): Promise<void> {
        await this.repoVehicle.delete({ id: vehicleId });
    }
}