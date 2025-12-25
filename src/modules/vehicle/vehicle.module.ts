import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleOrmEntity } from './entities/VehicleOrmEntity';
import { BmsVehicleController } from './controllers/bms-vehicle.controller';
import { BmsVehicleRepository } from './repositories/bms/bms-vehicle.repository';
import { TypeOrmBmsVehicleRepository } from './repositories/bms/typeorm-bms-vehicle.repository';
import { CreateVehicleUseCase } from './use-cases/bms/create-vehicle.usecase';
import { GetVehicleListByCompanyIdUseCase } from './use-cases/bms/get-vehicle-list-by-company-id.usecase';
import { UpdateVehicleUseCase } from './use-cases/bms/update-vehice.usecase';
import { DeleteVehicleUseCase } from './use-cases/bms/delete-vehicle.usecase';



@Module({
  imports: [TypeOrmModule.forFeature([VehicleOrmEntity])],
  controllers: [BmsVehicleController],
  providers: [
    {
      provide: BmsVehicleRepository,
      useClass: TypeOrmBmsVehicleRepository,
    },
    CreateVehicleUseCase,
    GetVehicleListByCompanyIdUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
  ],
  exports: [],
})
export class VehicleModule {}
