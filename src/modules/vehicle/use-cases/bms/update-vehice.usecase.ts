import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BmsVehicleRepository } from "../../repositories/bms/bms-vehicle.repository";
import { DTO_RQ_Vehicle } from "../../dtos/request/bms/bms-vehicle.request";
import { BmsVehicleMapper } from "../../mappers/bms-vehicle.mapper";

@Injectable()
export class UpdateVehicleUseCase {
    constructor(private readonly repo: BmsVehicleRepository) { }
    async execute(vehicleId: string, data: DTO_RQ_Vehicle) {
        const vehicle = await this.repo.findById(vehicleId);
        if (!vehicle) {
            throw new NotFoundException('Phương tiện không tồn tại.');
        }
        console.log("Vehicle:", vehicle);
        const licensePlate = data.license_plate
            .replace(/\s+/g, '')
            .trim()
            .toUpperCase();
        console.log("License Plate:", licensePlate);
        const existed = await this.repo.findOneByCompanyAndLicensePlate(
            vehicle.company_id,
            licensePlate,
        );

        if (existed && existed.id !== vehicleId) {
            throw new ConflictException('Biển số xe đã tồn tại.');
        }

        vehicle.license_plate = licensePlate;
        vehicle.brand = data.brand?.trim() || null;
        vehicle.color = data.color?.trim() || null;
        vehicle.engine_number = data.engine_number?.trim() || null;
        vehicle.frame_number = data.frame_number?.trim() || null;
        vehicle.phone = data.phone?.trim() || null;
        vehicle.registration_expiry = data.registration_expiry || null;
        vehicle.maintenance_due = data.maintenance_due || null;
        vehicle.status = data.status;

        await this.repo.saveVehicle(vehicle);

        const updated = await this.repo.findById(vehicleId);
        console.log("Updated Vehicle:", updated);
        return BmsVehicleMapper.toResponse(updated!);
    }
}