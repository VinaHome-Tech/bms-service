import { Module } from '@nestjs/common';
import { VehicleService } from './bms_vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { BmsVehicleController } from './controllers/bms-vehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [BmsVehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
