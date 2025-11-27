import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Route } from "src/entities/route.entity";
import { Schedule } from "src/entities/schedule.entity";
import { Repository } from "typeorm";

@Injectable()
export class PublicScheduleService {
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
    ) { }

    async GetSchedulesByCompanyAndRoute(companyId: string, routeId: string) {
        try {
            console.log('companyId:', companyId);
            console.log('routeId:', routeId);

            // 2. Kiểm tra route thuộc công ty
            const route = await this.routeRepository.findOne({
                where: { id: routeId, company_id: companyId },
                select: { id: true },
            });

            if (!route) {
                throw new NotFoundException('Tuyến đường không thuộc công ty này');
            }

            // 3. Lấy danh sách lịch chạy
            const schedules = await this.scheduleRepository.find({
                where: {
                    company_id: companyId,
                    route: { id: routeId },
                },
                relations: {
                    route: true,
                    seat_chart: true,
                },
                select: {
                    id: true,
                    start_date: true,
                    end_date: true,
                    weekdays: true,
                    start_time: true,
                    repeat_type: true,
                    odd_even_type: true,
                    is_known_end_date: true,
                    trip_type: true,
                    route: {
                        id: true,
                        route_name: true,
                        base_price: true,
                    },
                    seat_chart: {
                        id: true,
                        seat_chart_name: true,
                        total_seat: true,
                    },
                },
            });

            if (!schedules.length) {
                throw new NotFoundException('Không tìm thấy lịch chạy nào cho tuyến đường này');
            }

            return schedules;

        } catch (error) {
            if (error instanceof HttpException) throw error;

            console.error(error);
            throw new InternalServerErrorException(
                'Lỗi hệ thống. Vui lòng thử lại sau.'
            );
        }
    }

}