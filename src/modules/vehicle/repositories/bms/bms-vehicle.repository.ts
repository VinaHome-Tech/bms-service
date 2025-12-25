import { VehicleOrmEntity } from "../../entities/VehicleOrmEntity";

export abstract class BmsVehicleRepository {
    abstract findOneByCompanyAndLicensePlate(companyId: string, licensePlate: string): Promise<Partial<VehicleOrmEntity>>;
    abstract saveVehicle(
        vehicle: VehicleOrmEntity
    ): Promise<VehicleOrmEntity>;
    abstract findAllByCompanyId(companyId: string): Promise<VehicleOrmEntity[]>;
    abstract findById(vehicleId: string): Promise<VehicleOrmEntity>;
    abstract deleteVehicle(vehicleId: string): Promise<void>;
}