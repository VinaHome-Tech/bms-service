import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DTO_RP_Office, DTO_RP_OfficeRoomWork, DTO_RQ_Office } from './bms_office.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Office } from '../../entities/office.entity';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { OfficeMapper } from './office.mapper';
import { OfficePhone } from 'src/entities/office_phone.entity';

@Injectable()
export class BmsOfficeService {
  private readonly logger = new Logger(BmsOfficeService.name);
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(OfficePhone)
    private readonly officePhoneRepository: Repository<OfficePhone>,
    private readonly dataSource: DataSource,

  ) { }


  // M1_v2.F5
  async DeleteOffice(id: string) {
    this.logger.log(`Deleting office ${id}`);

    try {
      const office = await this.officeRepository.findOne({ where: { id } });
      if (!office) {
        throw new NotFoundException('Văn phòng không tồn tại');
      }

      // Xóa nhanh bằng SQL (phones sẽ cascade)
      await this.officeRepository.delete(id);

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`DeleteOffice failed for ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.',
      );
    }
  }


  // M1_v2.F4
  async UpdateOffice(id: string, data: DTO_RQ_Office) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // === 1. Lấy office + phones ===
      const office = await queryRunner.manager.findOne(Office, {
        where: { id },
        relations: ['phones'],
      });

      if (!office) {
        throw new NotFoundException('Văn phòng không tồn tại.');
      }

      // === 2. Chuẩn hóa dữ liệu ===
      const normalizedName = data.name.trim();
      const normalizedCode = data.code.trim().toUpperCase();
      const normalizedAddress = data.address.trim();
      const normalizedNote = data.note?.trim() || null;

      // === 3. Kiểm tra trùng name ===
      if (normalizedName !== office.name) {
        const existsName = await queryRunner.manager.findOne(Office, {
          where: { name: normalizedName, company_id: office.company_id },
        });
        if (existsName) {
          throw new ConflictException('Tên văn phòng đã tồn tại.');
        }
      }

      // === 4. Kiểm tra trùng code ===
      if (normalizedCode !== office.code) {
        const existsCode = await queryRunner.manager.findOne(Office, {
          where: { code: normalizedCode, company_id: office.company_id },
        });
        if (existsCode) {
          throw new ConflictException('Mã văn phòng đã tồn tại.');
        }
      }

      // === 5. Kiểm tra trùng phone trong request ===
      const phoneList = data.phones?.map(p => p.phone.trim()) || [];
      const duplicatePhone = phoneList.find(
        (p, idx) => phoneList.indexOf(p) !== idx,
      );
      if (duplicatePhone) {
        throw new ConflictException(
          `Số điện thoại bị trùng trong cùng văn phòng: ${duplicatePhone}`,
        );
      }

      // === 6. Update Office ===
      office.name = normalizedName;
      office.code = normalizedCode;
      office.address = normalizedAddress;
      office.note = normalizedNote;
      office.status = data.status;

      const existingPhoneIds = office.phones.map(p => p.id);
      const requestPhoneIds = data.phones.filter(p => p.id).map(p => p.id);

      // === 7. Xác định phones cần xóa ===
      const phonesToDelete = existingPhoneIds.filter(id => !requestPhoneIds.includes(id));
      if (phonesToDelete.length > 0) {
        await queryRunner.manager.delete(OfficePhone, phonesToDelete);
      }

      // === 8. Xác định phones cần update + thêm mới ===
      const updatedPhones: OfficePhone[] = [];

      for (const p of data.phones) {
        if (p.id && existingPhoneIds.includes(p.id)) {
          // Update phone cũ
          const existing = office.phones.find(x => x.id === p.id);
          existing.phone = p.phone.trim();
          existing.type = p.type.trim();
          updatedPhones.push(existing);
        } else {
          // Thêm số mới
          const newPhone = queryRunner.manager.create(OfficePhone, {
            phone: p.phone.trim(),
            type: p.type.trim(),
            office_id: office.id,
          });
          updatedPhones.push(newPhone);
        }
      }

      // === 9. Lưu office ===
      const savedOffice = await queryRunner.manager.save(Office, office);

      // === 10. Lưu phones ===
      const savedPhones = await queryRunner.manager.save(OfficePhone, updatedPhones);

      // === 11. Commit ===
      await queryRunner.commitTransaction();

      // === 12. Format response ===
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: {
          id: savedOffice.id,
          name: savedOffice.name,
          code: savedOffice.code,
          address: savedOffice.address,
          note: savedOffice.note,
          status: savedOffice.status,
          created_at: savedOffice.created_at,
          phones: savedPhones.map(p => ({
            id: p.id,
            phone: p.phone,
            type: p.type,
          })),
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error('UpdateOffice error', error.stack || error.message);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.'
      );
    } finally {
      await queryRunner.release();
    }
  }


  // M1_v2.F3
  async CreateOffice(companyId: string, data: DTO_RQ_Office) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ==== 0. Chuẩn hóa dữ liệu ====
      const normalizedName = data.name.trim();
      const normalizedCode = data.code.trim().toUpperCase();
      const normalizedAddress = data.address.trim();
      const normalizedNote = data.note?.trim() || null;

      // ==== 1. Kiểm tra tên trùng trong cùng công ty ====
      const existingByName = await queryRunner.manager.findOne(Office, {
        where: { name: normalizedName, company_id: companyId },
      });

      if (existingByName) {
        throw new ConflictException('Tên văn phòng đã tồn tại.');
      }

      // ==== 2. Kiểm tra code trùng ====
      const existingByCode = await queryRunner.manager.findOne(Office, {
        where: { code: normalizedCode, company_id: companyId },
      });

      if (existingByCode) {
        throw new ConflictException('Mã văn phòng đã tồn tại.');
      }

      // ==== 3. Kiểm tra trùng phone trong request ====
      const phoneNumbers = data.phones?.map((p) => p.phone.trim()) || [];
      const duplicatePhone = phoneNumbers.find(
        (p, index) => phoneNumbers.indexOf(p) !== index,
      );

      if (duplicatePhone) {
        throw new ConflictException(
          `Số điện thoại bị trùng trong cùng một văn phòng: ${duplicatePhone}`,
        );
      }

      // ==== 4. Tạo Office ====
      const office = queryRunner.manager.create(Office, {
        name: normalizedName,
        code: normalizedCode,
        address: normalizedAddress,
        note: normalizedNote,
        status: data.status,
        company_id: companyId,
      });

      const savedOffice = await queryRunner.manager.save(office);

      // ==== 5. Tạo phones (nếu có) ====
      let savedPhones: OfficePhone[] = [];

      if (data.phones?.length) {
        const phoneEntities = data.phones.map((p) =>
          queryRunner.manager.create(OfficePhone, {
            phone: p.phone.trim(),
            type: p.type.trim(),
            office_id: savedOffice.id,
          }),
        );

        savedPhones = await queryRunner.manager.save(OfficePhone, phoneEntities);
      }

      // ==== 6. Commit transaction ====
      await queryRunner.commitTransaction();

      // ==== 7. Trả về dữ liệu đầy đủ ====
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: {
          id: savedOffice.id,
          name: savedOffice.name,
          code: savedOffice.code,
          address: savedOffice.address,
          note: savedOffice.note,
          status: savedOffice.status,
          created_at: savedOffice.created_at,
          phones: savedPhones.map((phone) => ({
            id: phone.id,
            phone: phone.phone,
            type: phone.type,
          })),
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      await queryRunner.release();
    }
  }



  // M1_v2.F1
  async GetListOfficeRoomWorkByCompanyId(id: string) {
    try {
      const offices = await this.officeRepository.find({
        where: { company_id: id },
        relations: ['phones'],
        order: { created_at: 'ASC' },
        select: {
          id: true,
          name: true,
          address: true,
          status: true,
          phones: {
            id: true,
            phone: true,
            type: true,
          },
        },
      });
      if (!offices.length) {
        throw new NotFoundException('Không có văn phòng nào.');
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: offices,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }

  // M1_v2.F2
  async GetListOfficeByCompanyId(companyId: string) {
    try {
      const offices = await this.officeRepository.find({
        where: { company_id: companyId },
        relations: ['phones'],
        order: { created_at: 'ASC' },
        select: {
          id: true,
          name: true,
          code: true,
          address: true,
          note: true,
          status: true,
          created_at: true,
          phones: {
            id: true,
            phone: true,
            type: true,
          },
        },
      });
      if (!offices.length) {
        throw new NotFoundException('Không có văn phòng nào.');
      }

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: offices,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.'
      );
    }
  }




  // async createOffice(
  //   user: DTO_RQ_UserAction,
  //   data_create: DTO_RQ_Office,
  // ): Promise<DTO_RP_Office> {
  //   console.log('User:', user);
  //   console.log('Data Create:', data_create);
  //   const existingOffice = await this.officeRepository.findOne({
  //     where: {
  //       name: data_create.name,
  //       company_id: user.company_id,
  //     },
  //   });
  //   if (existingOffice) {
  //     throw new ConflictException('Tên văn phòng đã tồn tại.');
  //   }
  //   const office = OfficeMapper.toCreateEntity(user, data_create);
  //   const savedOffice = await this.officeRepository.save(office);
  //   if (savedOffice.phones) {
  //     savedOffice.phones.forEach((p) => delete p.office);
  //   }
  //   console.log('Saved Office:', savedOffice);
  //   return OfficeMapper.toDTO(savedOffice);
  // }

  // async deleteOffice(id: number, user: DTO_RQ_UserAction): Promise<void> {
  //   console.log('Delete Office ID:', id);
  //   console.log('User:', user);
  //   const office = await this.officeRepository.findOne({
  //     where: { id },
  //   });

  //   if (!office) {
  //     throw new NotFoundException('Văn phòng không tồn tại');
  //   }

  //   await this.officeRepository.remove(office);
  // }

  // async updateOffice(
  //   id: number,
  //   user: DTO_RQ_UserAction,
  //   data_update: DTO_RQ_Office,
  // ): Promise<DTO_RP_Office> {
  //   console.log('Update Office ID:', id);
  //   console.log('User:', user);
  //   console.log('Data Update:', data_update);
  //   const office = await this.officeRepository.findOne({
  //     where: { id },
  //     relations: ['phones'],
  //   });

  //   if (!office) {
  //     throw new NotFoundException('Văn phòng không tồn tại');
  //   }

  //   if (data_update.name) {
  //     const existingOffice = await this.officeRepository.findOne({
  //       where: {
  //         name: data_update.name,
  //         company_id: user.company_id,
  //       },
  //     });
  //     if (existingOffice && existingOffice.id !== id) {
  //       throw new ConflictException('Tên văn phòng đã tồn tại.');
  //     }
  //   }

  //   office.name = data_update.name;
  //   office.code = data_update.code;
  //   office.address = data_update.address;
  //   office.note = data_update.note;
  //   office.status = data_update.status;

  //   if (data_update.phones) {
  //     const inputPhones = data_update.phones;

  //     // IDs present in the incoming payload
  //     const inputPhoneIds = inputPhones.filter((p) => p.id).map((p) => p.id);

  //     // Phones that exist in DB but are not present in the incoming payload -> delete them
  //     const existingPhones = office.phones ?? [];
  //     const phonesToDelete = existingPhones.filter((p) => !inputPhoneIds.includes(p.id));
  //     if (phonesToDelete.length > 0) {
  //       // Use remove on the managed entities so TypeORM performs DELETE
  //       await this.officePhoneRepository.remove(phonesToDelete);
  //     }

  //     // Start with the remaining existing phones (those that matched input ids)
  //     office.phones = existingPhones.filter((p) => inputPhoneIds.includes(p.id));

  //     // Update existing ones and create new ones
  //     for (const phone of inputPhones) {
  //       if (phone.id) {
  //         const existing = office.phones.find((p) => p.id === phone.id);
  //         if (existing) {
  //           existing.phone = phone.phone;
  //           existing.type = phone.type;
  //         } else {
  //           // If input contained an id but it wasn't part of the loaded relation (edge case), create it
  //           const created = this.officePhoneRepository.create({
  //             phone: phone.phone,
  //             type: phone.type,
  //             office: office,
  //           });
  //           office.phones.push(created);
  //         }
  //       } else {
  //         const newPhone = this.officePhoneRepository.create({
  //           phone: phone.phone,
  //           type: phone.type,
  //           office: office,
  //         });
  //         office.phones.push(newPhone);
  //       }
  //     }
  //   }

  //   const updatedOffice = await this.officeRepository.save(office);

  //   if (updatedOffice.phones) {
  //     updatedOffice.phones.forEach((p) => delete p.office);
  //   }

  //   return updatedOffice;
  // }

  async getListOfficeByCompany(id: string): Promise<DTO_RP_Office[]> {
    const offices = await this.officeRepository.find({
      where: { company_id: id },
      relations: ['phones'],
      order: { created_at: 'DESC' },
    });
    return offices.map((office) => OfficeMapper.toDTO(office));
  }

  async getListOfficeNameByCompany(
    id: number,
  ): Promise<{ id: number; name: string }[]> {
    // const company = await this.companyRepository.findOne({
    //   where: { id },
    //   relations: ['offices'],
    // });

    // if (!company) {
    //   throw new NotFoundException('Công ty không tồn tại');
    // }
    return null;

    // return company.offices.map((office) => ({
    //   id: office.id,
    //   name: office.name,
    // }));
  }

  // BM-33 Get List Office Room Work By Company
  // async getListOfficeRoomWorkByCompany(id: string): Promise<DTO_RQ_Office[]> {
  //   const offices = await this.officeRepository
  //     .createQueryBuilder('office')
  //     .leftJoinAndSelect('office.phones', 'phone')
  //     .where('office.company_id = :companyId', { companyId: id })
  //     .orderBy('office.created_at', 'DESC')
  //     .select([
  //       'office.id',
  //       'office.name',
  //       'office.code',
  //       'office.address',
  //       'office.note',
  //       'office.status',
  //       'office.created_at',
  //       'phone.id',
  //       'phone.phone',
  //       'phone.type',
  //     ])
  //     .getMany();

  //   if (!offices || offices.length === 0) {
  //     throw new NotFoundException(
  //       'Không tìm thấy văn phòng nào cho công ty này',
  //     );
  //   }
  //   return offices.map((office) => OfficeMapper.toDTO(office));
  // }
}
