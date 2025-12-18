import { Module } from '@nestjs/common';
import { BmsOfficeService } from './bms_office.service';
import { Office } from '../../entities/office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficePhone } from 'src/entities/office_phone.entity';
import { BmsOfficeController } from './controllers/bms-office.controller';
import { BmsOfficeRepository } from './repositories/bms/bms-office.repository';
import { TypeOrmOfficeRepository } from './repositories/bms/typeorm-bms-office.repository';
import { OfficeOrmEntity } from './entities/OfficeOrmEntity';
import { OfficePhoneOrmEntity } from './entities/OfficePhoneOrmEntity';
import { CreateOfficeUseCase } from './use-cases/bms/create-office.usecase';
import { GetOfficeListByCompanyIdUseCase } from './use-cases/bms/get-office-list-by-company-id.usecase';
import { UpdateOfficeUseCase } from './use-cases/bms/update-office.usecase';
import { DeleteOfficeUseCase } from './use-cases/bms/delete-office.usecase';
import { GetOfficeListRoomWorkByCompanyIdUseCase } from './use-cases/bms/get-office-list-room-work-by-company-id.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Office, OfficePhone, OfficeOrmEntity, OfficePhoneOrmEntity])],
  controllers: [BmsOfficeController],
  providers: [
    {
      provide: BmsOfficeRepository,
      useClass: TypeOrmOfficeRepository,
    },
    CreateOfficeUseCase,
    UpdateOfficeUseCase,
    DeleteOfficeUseCase,
    GetOfficeListByCompanyIdUseCase,
    GetOfficeListRoomWorkByCompanyIdUseCase,
    BmsOfficeService],
  exports: [],
})
export class OfficeModule {}
