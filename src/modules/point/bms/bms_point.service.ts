// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Point } from 'src/entities/point.entity';
// import { Repository } from 'typeorm';
// import { RoutePoint } from 'src/entities/route_point.entity';
// import { Province } from 'src/entities/provinces.entity';
// import {
//   DTO_RP_GroupPointName,
//   DTO_RP_ItemPointConfigTime,
//   DTO_RP_RoutePointName,
//   DTO_RQ_ItemPointConfigTime,
// } from './bms_point.dto';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProvinceOrmEntity } from "src/modules/point/entities/ProvinceOrmEntity";
import { WardOrmEntity } from "src/modules/point/entities/WardOrmEntity";
import { Repository } from "typeorm";

@Injectable()
export class BmsPointService {
    constructor(

        @InjectRepository(ProvinceOrmEntity)
        private readonly provinceRepository: Repository<ProvinceOrmEntity>,
        @InjectRepository(WardOrmEntity)
        private readonly wardRepository: Repository<WardOrmEntity>,
    ) { }

    async addProvince() {
        console.log('Adding provinces...');
        const api = "https://provinces.open-api.vn/api/v2/p/";

        const response = await fetch(api);
        const provincesData = await response.json();
        console.log(provincesData);
        for (const prov of provincesData) {
            const province = new ProvinceOrmEntity();
            province.name = prov.name;
            province.code = prov.code;
            await this.provinceRepository.save(province);
            console.log(`Saved province: ${province.name}`);
        }

    }
    async addWard() {
        console.log('Adding wards...');
        try {
            const api = "https://provinces.open-api.vn/api/v2/w/";
            const response = await fetch(api);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
            }
            const wardData = await response.json();
            console.log(`Total wards: ${wardData.length}`);
            for (const w of wardData) {
                try {
                    const ward = new WardOrmEntity();

                    ward.name = w.name;
                    ward.code = w.code;
                    ward.province_code = w.province_code;

                    await this.wardRepository.save(ward);  // ⚠ phải dùng wardRepository
                    console.log(`Saved ward: ${ward.name}`);
                } catch (err) {
                    console.error(
                        `[WARD SAVE ERROR] ProvinceCode=${w.province_code}, WardCode=${w.code}, Name=${w.name}`
                    );
                    console.error(err.message);
                }
            }
        } catch (error) {
            console.error("❌ ERROR in addWard():", error.message);
            console.error(error);
        }
    }


    //   async getListRoutePointNameByRoute(route_id: number): Promise<DTO_RP_RoutePointName[]> {
    //     console.log('Get list route point by route id:', route_id);
    //     try {
    //       const routePoints = await this.routePointRepository.find({
    //         where: { route_id },
    //         relations: {
    //           point: true,
    //         },
    //         order: {
    //           display_order: 'ASC',
    //         },
    //         select: {
    //           id: true,
    //           display_order: true,
    //           time_gap: true,
    //           point: {
    //             id: true,
    //             name: true,
    //             address: true,
    //           },
    //         },
    //       });

    //       return routePoints.map((rp) => ({
    //         id: rp.id,
    //         point_name: rp.point.name,
    //         display_order: rp.display_order,
    //         time_gap: rp.time_gap,
    //         address: rp.point.address,
    //       }));
    //     } catch (error) {
    //       throw error;
    //     }
    //   }

    //   async getListPointNameByRoute(
    //     route_id: number,
    //   ): Promise<DTO_RP_GroupPointName[]> {
    //     if (!route_id || isNaN(route_id) || route_id <= 0) {
    //       throw new BadRequestException('Dữ liệu tuyến không hợp lệ');
    //     }

    //     try {
    //       console.log(`route_id: ${route_id}`);

    //       const routePoints = await this.routePointRepository.find({
    //         where: { route_id },
    //         relations: {
    //           point: {
    //             province: true,
    //           },
    //         },
    //         order: {
    //           display_order: 'ASC',
    //         },
    //         select: {
    //           point: {
    //             id: true,
    //             name: true,
    //             province: {
    //               id: true,
    //               name: true,
    //             },
    //           },
    //         },
    //       });

    //       // Nhóm các điểm theo tỉnh
    //       const groupedByProvince = new Map<number, DTO_RP_GroupPointName>();

    //       for (const rp of routePoints) {
    //         const province = rp.point.province;
    //         if (!province) continue;

    //         if (!groupedByProvince.has(province.id)) {
    //           groupedByProvince.set(province.id, {
    //             id: province.id,
    //             province_name: province.name,
    //             points: [],
    //           });
    //         }

    //         groupedByProvince.get(province.id).points.push({
    //           id: rp.point.id,
    //           name: rp.point.name,
    //         });
    //       }

    //       return Array.from(groupedByProvince.values());
    //     } catch (error) {
    //       console.error('❌ Lỗi khi lấy danh sách điểm theo tuyến:', error);
    //       throw new InternalServerErrorException(
    //         'Không thể lấy danh sách điểm theo tuyến',
    //       );
    //     }
    //   }

    //   async getListPointToConfigTimeByRoute(
    //     route_id: number,
    //   ): Promise<DTO_RP_ItemPointConfigTime[]> {
    //     if (!route_id || isNaN(route_id) || route_id <= 0) {
    //       throw new BadRequestException('Route data is invalid');
    //     }
    //     const routePoints = await this.routePointRepository.find({
    //       where: { route_id },
    //       relations: {
    //         point: true,
    //       },
    //       order: {
    //         display_order: 'ASC',
    //       },
    //       select: {
    //         id: true,
    //         display_order: true,
    //         time_gap: true,
    //         point: {
    //           id: true,
    //           name: true,
    //           address: true,
    //         },
    //       },
    //     });

    //     return routePoints.map((rp) => ({
    //       id: rp.id,
    //       point_name: rp.point.name,
    //       display_order: rp.display_order,
    //       time_gap: rp.time_gap,
    //       address: rp.point.address,
    //     }));
    //   }

    //   async updatePointConfigTimeByRoute(
    //     route_id: number,
    //     data: DTO_RQ_ItemPointConfigTime[],
    //   ): Promise<void> {
    //     if (!route_id || isNaN(route_id) || route_id <= 0) {
    //       throw new BadRequestException('Dữ liệu tuyến không hợp lệ');
    //     }
    //     if (!data || !Array.isArray(data) || data.length === 0) {
    //       throw new BadRequestException('Dữ liệu cập nhật không hợp lệ');
    //     }
    //     const routePoints = await this.routePointRepository.find({
    //       where: { route_id },
    //     });
    //     const routePointMap = new Map<number, RoutePoint>();
    //     routePoints.forEach((rp) => routePointMap.set(rp.id, rp));
    //     const toUpdate: RoutePoint[] = [];
    //     data.forEach((item) => {
    //       const rp = routePointMap.get(item.id);
    //       if (rp) {
    //         rp.time_gap = item.time_gap;
    //         rp.display_order = item.display_order;
    //         toUpdate.push(rp);
    //       } else {
    //         console.log(`⚠️ Bỏ qua: Không tìm thấy điểm dừng có ID=${item.id}`);
    //       }
    //     });
    //     if (toUpdate.length === 0) {
    //       throw new BadRequestException('Không có điểm dừng hợp lệ để cập nhật');
    //     }
    //     try {
    //       await this.routePointRepository.save(toUpdate);
    //       return;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
}
