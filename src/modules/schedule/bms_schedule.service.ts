import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DTO_RQ_Schedule } from "./bms_schedule.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedule } from "src/entities/schedule.entity";
import { Repository, DeepPartial } from "typeorm";
import { Route } from "src/entities/route.entity";
import { SeatChart } from "src/entities/seat_chart.entity";
import { toVNDate } from "src/utils/toVNDate";

@Injectable()
export class BmsScheduleService {
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
        @InjectRepository(SeatChart)
        private readonly seatChartRepository: Repository<SeatChart>,
    ) { }

    // M5_v2.F2
    async CreateSchedule(companyId: string, data: DTO_RQ_Schedule) {
        try {
            // ===== 1. Kiểm tra tuyến =====
            const route = await this.routeRepository.findOne({
                where: { id: data.route_id, company_id: companyId },
                select: { id: true, route_name: true },
            });

            if (!route) {
                throw new NotFoundException("Dữ liệu tuyến không tồn tại");
            }

            // ===== 2. Check seat chart nếu cần =====
            let seatChart: SeatChart | null = null;

            if (data.trip_type !== 2) {
                // Trip chở khách bắt buộc phải có seat chart
                if (!data.seat_chart_id) {
                    throw new BadRequestException("Sơ đồ ghế là bắt buộc đối với loại chuyến này");
                }
            }

            if (data.seat_chart_id) {
                seatChart = await this.seatChartRepository.findOne({
                    where: { id: data.seat_chart_id, company_id: companyId },
                    select: { id: true, seat_chart_name: true },
                });

                if (!seatChart) {
                    throw new NotFoundException("Dữ liệu sơ đồ ghế không tồn tại");
                }
            }

            // ===== 3. Validate logic repeat type =====
            if (data.repeat_type === "weekday" && (!data.weekdays || data.weekdays.length === 0)) {
                throw new BadRequestException("weekdays không được để trống khi repeat_type = 'weekday'");
            }

            if (data.repeat_type === "odd_even" && !data.odd_even_type) {
                throw new BadRequestException("odd_even_type là bắt buộc khi repeat_type = 'odd_even'");
            }

            // ===== 4. Tạo schedule =====
            const schedule = this.scheduleRepository.create({
                start_date: data.start_date,
                end_date: data.end_date || null,
                start_time: data.start_time,
                trip_type: data.trip_type,
                repeat_type: data.repeat_type,
                weekdays: data.weekdays || null,
                odd_even_type: data.odd_even_type || null,
                is_known_end_date: data.is_known_end_date,
                company_id: companyId,
                route: { id: data.route_id },
                seat_chart: data.seat_chart_id ? { id: data.seat_chart_id } : null,
            });

            await this.scheduleRepository.save(schedule);

            // ===== 5. Trả về response =====
            return {
                success: true,
                message: "Success",
                statusCode: HttpStatus.CREATED,
                result: {
                    id: schedule.id,
                    start_date: schedule.start_date,
                    end_date: schedule.end_date,
                    route_id: route.id,
                    route_name: route.route_name,
                    seat_chart_id: seatChart?.id || null,
                    seat_chart_name: seatChart?.seat_chart_name || null,
                    start_time: schedule.start_time,
                    trip_type: schedule.trip_type,
                    repeat_type: schedule.repeat_type,
                    weekdays: schedule.weekdays,
                    odd_even_type: schedule.odd_even_type,
                    is_known_end_date: schedule.is_known_end_date,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException("Lỗi hệ thống. Vui lòng thử lại sau.");
        }
    }


    // M5_v2.F1
    async GetListScheduleByCompanyId(companyId: string) {
        try {
            console.time('GetSchedules');
            const schedules = await this.scheduleRepository.find({
                where: {
                    company_id: companyId,
                },
                select: {
                    id: true,
                    start_date: true,
                    end_date: true,
                    start_time: true,
                    trip_type: true,
                    repeat_type: true,
                    weekdays: true,
                    odd_even_type: true,
                    is_known_end_date: true,
                    route: {
                        id: true,
                        route_name: true,
                    },
                    seat_chart: {
                        id: true,
                        seat_chart_name: true,
                    },
                },
                relations: ['route', 'seat_chart'],
                order: {
                    created_at: 'DESC',
                },
            });
            const response = schedules.map(schedule => ({
                id: schedule.id,
                start_date: toVNDate(schedule.start_date),
                end_date: schedule.end_date ? toVNDate(schedule.end_date) : null,
                route_id: schedule.route.id,
                route_name: schedule.route.route_name,
                seat_chart_id: schedule.seat_chart ? schedule.seat_chart.id : null,
                seat_chart_name: schedule.seat_chart ? schedule.seat_chart.seat_chart_name : null,
                start_time: schedule.start_time,
                trip_type: schedule.trip_type,
                repeat_type: schedule.repeat_type,
                weekdays: schedule.weekdays,
                odd_even_type: schedule.odd_even_type,
                is_known_end_date: schedule.is_known_end_date,
            }));
            return {
                success: true,
                message: 'Success',
                statusCode: HttpStatus.OK,
                result: response,
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error(error);
            throw new InternalServerErrorException('Lấy danh sách lịch chạy thất bại');
        } finally {
            console.timeEnd('GetSchedules');
        }
    }

    // M5_v2.F3
    async UpdateSchedule(scheduleId: string, data: DTO_RQ_Schedule) {
        try {
            console.time('UpdateSchedule');
            const schedule = await this.scheduleRepository.findOne({
                where: {
                    id: scheduleId,
                },
                select: {
                    id: true,
                    start_date: true,
                    end_date: true,
                    start_time: true,
                    trip_type: true,
                    repeat_type: true,
                    weekdays: true,
                    odd_even_type: true,
                    is_known_end_date: true,
                    route: {
                        id: true,
                        route_name: true,
                    },
                    seat_chart: {
                        id: true,
                        seat_chart_name: true,
                    },
                },
                relations: ['seat_chart', 'route'],
            });
            if (!schedule) {
                throw new NotFoundException('Dữ liệu lịch chạy không tồn tại');
            }
            await this.scheduleRepository.update(scheduleId, {
                start_date: data.start_date,
                end_date: data.end_date,
                seat_chart: data.seat_chart_id,
                start_time: data.start_time,
                trip_type: data.trip_type,
                repeat_type: data.repeat_type,
                weekdays: data.weekdays,
                odd_even_type: data.odd_even_type,
                is_known_end_date: data.is_known_end_date,
            } as DeepPartial<Schedule>);
            const response = {
                id: schedule.id,
                start_date: data.start_date,
                end_date: data.end_date,
                route_id: schedule.route.id,
                route_name: schedule.route.route_name,
                seat_chart_id: schedule.seat_chart ? schedule.seat_chart.id : null,
                seat_chart_name: schedule.seat_chart ? schedule.seat_chart.seat_chart_name : null,
                start_time: data.start_time,
                trip_type: data.trip_type,
                repeat_type: data.repeat_type,
                weekdays: data.weekdays,
                odd_even_type: data.odd_even_type,
                is_known_end_date: data.is_known_end_date,
            }
            return {
                success: true,
                message: 'Cập nhật lịch chạy thành công',
                statusCode: HttpStatus.OK,
                result: response,
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error(error);
            throw new InternalServerErrorException('Cập nhật lịch chạy thất bại');
        } finally {
            console.timeEnd('UpdateSchedule');
        }
    }

    // M5_v2.F4
    async DeleteSchedule(scheduleId: string) {
        try {
            console.time('DeleteSchedule');
            const schedule = await this.scheduleRepository.findOne({
                where: {
                    id: scheduleId,
                },
            });
            if (!schedule) {
                throw new NotFoundException('Dữ liệu lịch chạy không tồn tại');
            }
            await this.scheduleRepository.delete(scheduleId);
            return {
                success: true,
                message: 'Xoá lịch chạy thành công',
                statusCode: HttpStatus.OK,
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error(error);
            throw new InternalServerErrorException('Xoá lịch chạy thất bại');
        } finally {
            console.timeEnd('DeleteSchedule');
        }
    }
}