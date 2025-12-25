import { Injectable } from "@nestjs/common";
import { BmsVehicleRepository } from "../../repositories/bms/bms-vehicle.repository";

@Injectable()
export class DeleteVehicleUseCase {
    constructor(private readonly repo: BmsVehicleRepository) { }
    async execute(vehicleId: string) {
        return this.repo.deleteVehicle(vehicleId);
    }
}