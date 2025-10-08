import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { Office } from '../../entities/office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficePhone } from './office_phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Office, OfficePhone])],
  controllers: [OfficeController],
  providers: [OfficeService],
  exports: [],
})
export class OfficeModule {}
