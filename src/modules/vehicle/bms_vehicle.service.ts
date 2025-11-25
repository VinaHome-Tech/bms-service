import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DTO_RP_LicensePlate,
  DTO_RP_RegistrationExpiry,
  DTO_RP_Vehicle,
  DTO_RQ_Vehicle,
} from './bms_vehicle.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { VehicleMapper } from './vehicle.mapper';
import { Vehicle } from 'src/entities/vehicle.entity';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) { }

  // M2_v2.F1
  async GetListVehicleByCompanyId(companyId: string) {
    try {
      const vehicles = await this.vehicleRepository.find({
        where: { company_id: companyId },
        order: { created_at: 'ASC' },
        select: {
          id: true,
          license_plate: true,
          engine_number: true,
          frame_number: true,
          status: true,
          color: true,
          brand: true,
          phone: true,
          registration_expiry: true,
          maintenance_due: true,
        },
      });
      if (!vehicles.length) {
        throw new NotFoundException('Không có phương tiện nào.');
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: vehicles,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    } 
  }

  // M2_v2.F2
  async CreateVehicle(companyId: string, data: DTO_RQ_Vehicle) {
    try {
      // === 1. Chuẩn hóa dữ liệu ===
      const licensePlate = data.license_plate.trim().toUpperCase();
      const engineNumber = data.engine_number?.trim() || null;
      const frameNumber = data.frame_number?.trim() || null;

      // === 2. Kiểm tra trùng biển số trong cùng công ty ===
      const existPlate = await this.vehicleRepository.findOne({
        where: { license_plate: licensePlate, company_id: companyId },
      });

      if (existPlate) {
        throw new ConflictException('Biển số xe đã tồn tại.');
      }

      // === 3. Kiểm tra trùng số máy / số khung (nếu có) ===
      if (engineNumber) {
        const existEngine = await this.vehicleRepository.findOne({
          where: { engine_number: engineNumber, company_id: companyId },
        });
        if (existEngine) {
          throw new ConflictException('Số máy đã tồn tại.');
        }
      }

      if (frameNumber) {
        const existFrame = await this.vehicleRepository.findOne({
          where: { frame_number: frameNumber, company_id: companyId },
        });
        if (existFrame) {
          throw new ConflictException('Số khung đã tồn tại.');
        }
      }

      // === 4. Logic validate ngày đăng kiểm ===
      if (data.registration_expiry) {
        const regDate = new Date(data.registration_expiry);
        if (regDate < new Date('2000-01-01')) {
          throw new BadRequestException('Ngày đăng kiểm không hợp lệ.');
        }
      }

      // === 5. Tạo entity ===
      const newVehicle = this.vehicleRepository.create({
        ...data,
        license_plate: licensePlate,
        engine_number: engineNumber,
        frame_number: frameNumber,
        company_id: companyId,
      });

      const saved = await this.vehicleRepository.save(newVehicle);

      // === 6. Chuẩn hóa response ===
      const response = {
        id: saved.id,
        license_plate: saved.license_plate,
        engine_number: saved.engine_number,
        frame_number: saved.frame_number,
        status: saved.status,
        color: saved.color,
        brand: saved.brand,
        phone: saved.phone,
        registration_expiry: saved.registration_expiry,
        maintenance_due: saved.maintenance_due,
        created_at: saved.created_at,
      };

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: response,
      };

    } catch (error) {
      this.logger.error(error);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.'
      );
    }
  }


  // M2_v2.F3
  async UpdateVehicle(id: string, data: DTO_RQ_Vehicle) {
    try {
      console.time('UpdateVehicle');
      const vehicle = await this.vehicleRepository.findOne({
        where: { id },
      });
      if (!vehicle) {
        throw new NotFoundException('Phương tiện không tồn tại');
      }
      if (data.license_plate && data.license_plate !== vehicle.license_plate) {
        const existingVehicle = await this.vehicleRepository.findOne({
          where: {
            company_id: vehicle.company_id,
            license_plate: data.license_plate,
          },
        });

        if (existingVehicle) {
          throw new ConflictException('Biển số xe đã tồn tại trong công ty này');
        }
      }
      Object.assign(vehicle, data);
      const response = await this.vehicleRepository.save(vehicle);
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: response,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error deleting office:', error);
      throw new InternalServerErrorException('Cập nhật phương tiện thất bại');
    } finally {
      console.timeEnd('UpdateVehicle');
    }
  }

  // M2_v2.F4
  async DeleteVehicle(id: string) {
    try {
      const vehicle = await this.vehicleRepository.findOne({ where: { id } });

      if (!vehicle) {
        throw new NotFoundException('Phương tiện không tồn tại');
      }

      await this.vehicleRepository.delete(vehicle.id);
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    } 
  }

  async GetListLicensePlateVehicleByCompanyId(id: string) {
    try {
      console.time('GetListLicensePlateVehicleByCompanyId');
      const vehicles = await this.vehicleRepository.find({
        where: { company_id: id },
        select: {
          id: true,
          license_plate: true,
          phone: true,
        },
        order: { id: 'ASC' },
      });
      if (!vehicles.length) {
        throw new NotFoundException('Không có phương tiện nào cho công ty này');
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: vehicles,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error deleting office:', error);
      throw new InternalServerErrorException('Láy danh sách phương tiện thất bại');
    } finally {
      console.timeEnd('GetListLicensePlateVehicleByCompanyId');
    }
  }

  // async createVehicle(
  //   user: DTO_RQ_UserAction,
  //   data_create: DTO_RQ_Vehicle,
  // ): Promise<DTO_RP_Vehicle> {
  //   console.log('User:', user);
  //   console.log('Data Create:', data_create);

  //   const existingVehicle = await this.vehicleRepository.findOne({
  //     where: {
  //       license_plate: data_create.license_plate,
  //       company_id: user.company_id,
  //     },
  //   });
  //   if (existingVehicle) {
  //     throw new ConflictException('Biển số xe đã tồn tại.');
  //   }
  //   const vehicle = VehicleMapper.toEntity(user, data_create);
  //   const savedVehicle = await this.vehicleRepository.save(vehicle);
  //   return VehicleMapper.toDTO(savedVehicle);
  // }

  // async getListVehicleByCompany(id: string): Promise<DTO_RP_Vehicle[]> {
  //   const vehicles = await this.vehicleRepository.find({
  //     where: { company_id: id },
  //   });

  //   if (!vehicles.length) {
  //     throw new NotFoundException('Không có phương tiện nào cho công ty này');
  //   }

  //   return vehicles.map((vehicle) => VehicleMapper.toDTO(vehicle));
  // }

  // async updateVehicle(
  //   id: number,
  //   user: DTO_RQ_UserAction,
  //   data_update: DTO_RQ_Vehicle,
  // ): Promise<DTO_RP_Vehicle> {
  //   console.log('Update Vehicle ID:', id);
  //   console.log('User:', user);
  //   console.log('Data Update:', data_update);
  //   const existingVehicle = await this.vehicleRepository.findOne({
  //     where: { id },
  //   });

  //   if (!existingVehicle) {
  //     throw new NotFoundException('Phương tiện không tồn tại');
  //   }

  //   if (
  //     data_update.license_plate &&
  //     data_update.license_plate !== existingVehicle.license_plate
  //   ) {
  //     const vehicleWithSamePlate = await this.vehicleRepository.findOne({
  //       where: {
  //         license_plate: data_update.license_plate,
  //         company_id: user.company_id,
  //       },
  //     });

  //     if (vehicleWithSamePlate && vehicleWithSamePlate.id !== id) {
  //       throw new ConflictException('Biển số xe đã tồn tại.');
  //     }
  //   }

  //   Object.assign(existingVehicle, data_update);
  //   const updatedVehicle = await this.vehicleRepository.save(existingVehicle);
  //   return VehicleMapper.toDTO(updatedVehicle);
  // }

  // async deleteVehicle(id: number, user: DTO_RQ_UserAction): Promise<void> {
  //   console.log('Delete Vehicle ID:', id);
  //   console.log('User:', user);
  //   const vehicle = await this.vehicleRepository.findOne({ where: { id } });

  //   if (!vehicle) {
  //     throw new NotFoundException('Phương tiện không tồn tại');
  //   }

  //   await this.vehicleRepository.remove(vehicle);
  // }

  // BM-32: Get License Plate By Company
  async getLicensePlateByCompany(id: string): Promise<DTO_RP_LicensePlate[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('v')
      .select(['v.id AS id', 'v.license_plate AS license_plate'])
      .where('v.company_id = :id', { id })
      .andWhere('v.status = :status', { status: 1 })
      .getRawMany<DTO_RP_LicensePlate>();

    if (!vehicles.length) {
      throw new NotFoundException('Không có phương tiện nào');
    }

    return vehicles;
  }

  // BM-34 Get List Registration Expiry
  // async getListRegistrationExpiry(
  //   id: string,
  // ): Promise<DTO_RP_RegistrationExpiry[]> {
  //   const vehicles = await this.vehicleRepository.find({
  //     where: { company_id: id },
  //     select: {
  //       id: true,
  //       license_plate: true,
  //       registration_expiry: true,
  //     },
  //     order: { registration_expiry: 'ASC' },
  //   });
  //   if (!vehicles.length) {
  //     throw new NotFoundException('Không có phương tiện nào');
  //   }
  //   return vehicles;
  // }
}
