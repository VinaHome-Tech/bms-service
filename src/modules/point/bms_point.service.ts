import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'src/entities/point.entity';
import { Repository } from 'typeorm';
import { RoutePoint } from 'src/entities/route_point.entity';
import { Province } from 'src/entities/provinces.entity';
import {
  DTO_RP_GroupPointName,
  DTO_RP_ItemPointConfigTime,
  DTO_RQ_ItemPointConfigTime,
} from './bms_point.dto';

@Injectable()
export class BmsPointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(RoutePoint)
    private routePointRepository: Repository<RoutePoint>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async getListPointNameByRoute(
    route_id: number,
  ): Promise<DTO_RP_GroupPointName[]> {
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
      throw new InternalServerErrorException(
        'Không thể lấy danh sách điểm theo tuyến',
      );
    }
  }

  async getListPointToConfigTimeByRoute(
    route_id: number,
  ): Promise<DTO_RP_ItemPointConfigTime[]> {
    if (!route_id || isNaN(route_id) || route_id <= 0) {
      throw new BadRequestException('Route data is invalid');
    }
    const routePoints = await this.routePointRepository.find({
      where: { route_id },
      relations: {
        point: true,
      },
      order: {
        display_order: 'ASC',
      },
      select: {
        id: true,
        display_order: true,
        time_gap: true,
        point: {
          id: true,
          name: true,
          address: true,
        },
      },
    });

    return routePoints.map((rp) => ({
      id: rp.id,
      point_name: rp.point.name,
      display_order: rp.display_order,
      time_gap: rp.time_gap,
      address: rp.point.address,
    }));
  }

  async updatePointConfigTimeByRoute(
    route_id: number,
    data: DTO_RQ_ItemPointConfigTime[],
  ) {
    console.log('🚀 [BẮT ĐẦU] Cập nhật cấu hình thời gian cho tuyến đường');
    console.log('➡️ Dữ liệu đầu vào:', { route_id, data });

    // --- Bước 1: Kiểm tra route_id ---
    if (!route_id || isNaN(route_id) || route_id <= 0) {
      console.log('❌ Lỗi: route_id không hợp lệ');
      throw new BadRequestException('Route data is invalid');
    }

    // --- Bước 2: Kiểm tra dữ liệu cập nhật ---
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('❌ Lỗi: dữ liệu cập nhật không hợp lệ hoặc rỗng');
      throw new BadRequestException('Update data is invalid');
    }

    // --- Bước 3: Lấy danh sách điểm dừng của tuyến ---
    console.log(
      `🔍 Đang tìm các điểm dừng thuộc tuyến có ID = ${route_id} ...`,
    );
    const routePoints = await this.routePointRepository.find({
      where: { route_id },
    });

    console.log(`✅ Tìm thấy ${routePoints.length} điểm dừng trong tuyến`);

    // --- Bước 4: Tạo Map để tra cứu nhanh theo ID ---
    const routePointMap = new Map<number, RoutePoint>();
    routePoints.forEach((rp) => routePointMap.set(rp.id, rp));
    console.log('🗺️ Đã tạo Map tra cứu điểm dừng theo ID');

    // --- Bước 5: Duyệt và tạo danh sách cập nhật ---
    const toUpdate: RoutePoint[] = [];
    data.forEach((item) => {
      const rp = routePointMap.get(item.id);
      if (rp) {
        console.log(
          `🔧 Cập nhật điểm dừng ID=${item.id}: time_gap=${item.time_gap}, display_order=${item.display_order}`,
        );
        rp.time_gap = item.time_gap;
        rp.display_order = item.display_order;
        toUpdate.push(rp);
      } else {
        console.log(`⚠️ Bỏ qua: Không tìm thấy điểm dừng có ID=${item.id}`);
      }
    });

    // --- Bước 6: Kiểm tra có điểm nào cần cập nhật không ---
    if (toUpdate.length === 0) {
      console.log('❌ Không có điểm dừng hợp lệ để cập nhật');
      throw new BadRequestException('No valid route points to update');
    }

    // --- Bước 7: Tiến hành lưu thay đổi vào CSDL ---
    console.log(
      `💾 Đang lưu ${toUpdate.length} điểm dừng vào cơ sở dữ liệu...`,
    );
    try {
      await this.routePointRepository.save(toUpdate);
      console.log(`✅ Cập nhật thành công ${toUpdate.length} điểm dừng`);
      console.log('🎯 [HOÀN THÀNH] Cập nhật cấu hình thời gian cho tuyến');
      return { updated: toUpdate.length };
    } catch (error) {
      console.log('🔥 Lỗi khi lưu dữ liệu:', error.message || error);
      throw error;
    }
  }
}
