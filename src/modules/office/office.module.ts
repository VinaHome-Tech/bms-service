import { Module } from '@nestjs/common';
import { BmsOfficeController } from './bms_office.controller';
import { BmsOfficeService } from './bms_office.service';
import { Office } from '../../entities/office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficePhone } from './office_phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Office, OfficePhone])],
  controllers: [BmsOfficeController],
  providers: [BmsOfficeService],
  exports: [],
})
export class OfficeModule {}
