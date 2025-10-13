import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point } from "src/entities/point.entity";
import { Repository } from "typeorm";
import { DTO_RP_PointName } from "./point.dto";
import { RoutePoint } from "src/entities/route_point.entity";
import { Province } from "src/entities/provinces.entity";
import { DTO_RP_GroupPointName } from "./bms_point.dto";

@Injectable()
export class BmsPointService {
    constructor(
        @InjectRepository(Point)
        private pointRepository: Repository<Point>,
        @InjectRepository(RoutePoint)
        private routePointRepository: Repository<RoutePoint>,
        @InjectRepository(Province)
        private provinceRepository: Repository<Province>,
    ) { }

    async getListPointNameByRoute(route_id: number): Promise<DTO_RP_GroupPointName[]> {
        if (!route_id || isNaN(route_id) || route_id <= 0) {
            throw new BadRequestException('Dữ liệu tuyến không hợp lệ');
        }

        try {
            console.log(`route_id: ${route_id}`);

            const routePoints = await this.routePointRepository.find({
                where: { route_id },
                relations: {
                    point: {
                        province: true,
                    },
                },
                order: {
                    display_order: 'ASC',
                },
                select: {
                    point: {
                        id: true,
                        name: true,
                        province: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            // Nhóm các điểm theo tỉnh
            const groupedByProvince = new Map<number, DTO_RP_GroupPointName>();

            for (const rp of routePoints) {
                const province = rp.point.province;
                if (!province) continue;

                if (!groupedByProvince.has(province.id)) {
                    groupedByProvince.set(province.id, {
                        id: province.id,
                        province_name: province.name,
                        points: [],
                    });
                }

                groupedByProvince.get(province.id).points.push({
                    id: rp.point.id,
                    name: rp.point.name,
                });
            }

            return Array.from(groupedByProvince.values());
        } catch (error) {
            console.error('❌ Lỗi khi lấy danh sách điểm theo tuyến:', error);
            throw new InternalServerErrorException('Không thể lấy danh sách điểm theo tuyến');
        }
    }
}
