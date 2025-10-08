import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
