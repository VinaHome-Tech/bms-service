import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { Company } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Company])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
