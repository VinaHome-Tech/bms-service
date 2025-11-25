// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Province } from 'src/entities/provinces.entity';
// import { Ward } from 'src/entities/wards.entity';
// import { Repository } from 'typeorm';
// import {
//   DTO_RP_Point,
//   DTO_RP_PointName,
//   DTO_RP_Province,
//   DTO_RP_Ward,
//   DTO_RQ_Point,
// } from './point.dto';
// import { Point } from 'src/entities/point.entity';

// @Injectable()
// export class PlatformPointService {
//   constructor(
//     @InjectRepository(Province)
//     private provinceRepository: Repository<Province>,

//     @InjectRepository(Ward)
//     private wardRepository: Repository<Ward>,

//     @InjectRepository(Point)
//     private pointRepository: Repository<Point>,
//   ) {}

//   async importProvince() {
//     try {
//       const response = await fetch('https://provinces.open-api.vn/api/v2/p/');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const provinces = await response.json();

//       for (const p of provinces) {
//         const province = this.provinceRepository.create({
//           name: p.name,
//           code: p.code,
//           division_type: p.division_type,
//           codename: p.codename,
//           phone_code: p.phone_code,
//         });
//         await this.provinceRepository.save(province);
//       }

//       return { success: true, message: 'Provinces imported successfully' };
//     } catch (error) {
//       console.error('Import provinces failed:', error);
//       return { success: false, message: 'Failed to import provinces' };
//     }
//   }

//   async importWard() {
//     try {
//       const response = await fetch('https://provinces.open-api.vn/api/v2/w/');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const wards = await response.json();
//       for (const w of wards) {
//         const ward = this.wardRepository.create({
//           name: w.name,
//           code: w.code,
//           division_type: w.division_type,
//           codename: w.codename,
//           province_code: w.province_code,
//         });
//         await this.wardRepository.save(ward);
//       }
//       return { success: true, message: 'Wards imported successfully' };
//     } catch (error) {
//       console.error('Import wards failed:', error);
//       return { success: false, message: 'Failed to import wards' };
//     }
//   }

//   async getProvinces(): Promise<DTO_RP_Province[]> {
//     try {
//       const provinces = await this.provinceRepository.find({
//         select: ['id', 'name', 'code'],
//         order: { name: 'ASC' },
//       });

//       return provinces.map((p) => ({
//         id: p.id,
//         name: p.name,
//         code: p.code,
//       }));
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getWardsByProvinceCode(provinceCode: number): Promise<DTO_RP_Ward[]> {
//     try {
//       const wards = await this.wardRepository.find({
//         where: { province_code: provinceCode },
//         select: ['id', 'name', 'code'],
//         order: { name: 'ASC' },
//       });
//       return wards.map((w) => ({
//         id: w.id,
//         name: w.name,
//         code: w.code,
//       }));
//     } catch (error) {
//       throw error;
//     }
//   }

//   async createPoint(data: DTO_RQ_Point): Promise<DTO_RP_Point> {
//     try {
//       const [province, ward] = await Promise.all([
//         this.provinceRepository.findOne({
//           where: { code: data.province_code },
//           select: ['code', 'name'],
//         }),
//         this.wardRepository.findOne({
//           where: { code: data.ward_code },
//           select: ['code', 'name'],
//         }),
//       ]);

//       if (!province) {
//         throw new BadRequestException('Không tìm thấy tỉnh/thành phố');
//       }

//       if (!ward) {
//         throw new BadRequestException('Không tìm thấy phường/xã');
//       }

//       const point = this.pointRepository.create({
//         name: data.name.trim(),
//         short_name: data.short_name.trim(),
//         address: data.address?.trim() || null,
//         province_code: province.code,
//         ward_code: ward.code,
//       });

//       const savedPoint = await this.pointRepository.save(point);

//       return {
//         id: savedPoint.id,
//         name: savedPoint.name,
//         short_name: savedPoint.short_name,
//         address: savedPoint.address,
//         province_code: savedPoint.province_code,
//         ward_code: savedPoint.ward_code,
//         province_name: province.name,
//         ward_name: ward.name,
//       };
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getListPoint(): Promise<DTO_RP_Point[]> {
//     try {
//       const points = await this.pointRepository
//         .createQueryBuilder('p')
//         .leftJoinAndSelect('p.province', 'province')
//         .leftJoinAndSelect('p.ward', 'ward')
//         .select([
//           'p.id',
//           'p.name',
//           'p.short_name',
//           'p.address',
//           'p.province_code',
//           'p.ward_code',
//           'province.name',
//           'ward.name',
//         ])
//         .orderBy('p.id', 'ASC')
//         .getMany();

//       return points.map((p) => ({
//         id: p.id,
//         name: p.name,
//         short_name: p.short_name,
//         address: p.address,
//         province_code: p.province_code,
//         province_name: p.province?.name ?? null,
//         ward_code: p.ward_code,
//         ward_name: p.ward?.name ?? null,
//       }));
//     } catch (error) {
//       throw error;
//     }
//   }

//   async deletePoint(id: number): Promise<void> {
//     try {
//       const point = await this.pointRepository.findOne({ where: { id } });
//       if (!point) {
//         throw new BadRequestException('Điểm không tồn tại');
//       }
//       await this.pointRepository.remove(point);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async updatePoint(id: number, data: DTO_RQ_Point): Promise<DTO_RP_Point> {
//     try {
//       const point = await this.pointRepository.findOne({ where: { id } });
//       if (!point) {
//         throw new BadRequestException('Điểm không tồn tại');
//       }
//       const [province, ward] = await Promise.all([
//         this.provinceRepository.findOne({
//           where: { code: data.province_code },
//           select: ['code', 'name'],
//         }),
//         this.wardRepository.findOne({
//           where: { code: data.ward_code },
//           select: ['code', 'name'],
//         }),
//       ]);
//       if (!province) {
//         throw new BadRequestException('Không tìm thấy tỉnh/thành phố');
//       }
//       if (!ward) {
//         throw new BadRequestException('Không tìm thấy phường/xã');
//       }
//       point.name = data.name.trim();
//       point.short_name = data.short_name.trim();
//       point.address = data.address?.trim() || null;
//       point.province_code = province.code;
//       point.ward_code = ward.code;
//       await this.pointRepository.save(point);
//       return {
//         id: point.id,
//         name: point.name,
//         short_name: point.short_name,
//         address: point.address,
//         province_code: point.province_code,
//         ward_code: point.ward_code,
//         province_name: province.name,
//         ward_name: ward.name,
//       };
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getListPointName(): Promise<DTO_RP_PointName[]> {
//     try {
//       const points = await this.pointRepository.find({
//         select: ['id', 'name'],
//         order: { id: 'ASC' },
//       });
//       return points.map((p) => ({
//         id: p.id,
//         name: p.name,
//       }));
//     } catch (error) {
//       throw error;
//     } 
//   }
// }
