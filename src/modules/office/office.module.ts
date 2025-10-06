import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { Office } from './office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficePhone } from './office_phone.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Office, OfficePhone]), CompanyModule],
  controllers: [OfficeController],
  providers: [OfficeService],
  exports: [],
})
export class OfficeModule {}
