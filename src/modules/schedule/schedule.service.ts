import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DTO_RP_Schedule,
  DTO_RQ_CreateSchedule,
  DTO_RQ_UpdateSchedule,
} from './schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { Route } from '../route/route.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async createSchedule(data: DTO_RQ_CreateSchedule): Promise<DTO_RP_Schedule> {
    console.log('Received data for createSchedule:', data);

    const existingCompany = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });
    if (!existingCompany) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existingRoute = await this.routeRepository.findOne({
      where: {
        id: data.route_id,
        // company: { id: data.company_id },
      },
      relations: ['company'],
    });
    if (!existingRoute) {
      throw new NotFoundException(
        'Tuyến đường không tồn tại trong công ty này',
      );
    }

    if (data.seat_chart_id != null) {
      const existingSeatChart = await this.seatChartRepository.findOne({
        where: {
          id: data.seat_chart_id,
          // company: { id: data.company_id },
        },
        relations: ['company'],
      });
      if (!existingSeatChart) {
        throw new NotFoundException(
          'Sơ đồ ghế không tồn tại trong công ty này',
        );
      }
    }

    const parseDateWithoutTimezone = (dateString: string): Date => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const startDate = parseDateWithoutTimezone(data.start_date);
    const endDate = data.is_known_end_date
      ? parseDateWithoutTimezone(data.end_date)
      : null;

    const scheduleEntity = this.scheduleRepository.create({
      ...data,
      company: { id: data.company_id },
      route: { id: data.route_id },
      seat_chart: data.seat_chart_id ? { id: data.seat_chart_id } : null,
      start_date: startDate,
      end_date: endDate,
      weekdays: data.weekdays,
    });

    const savedSchedule = await this.scheduleRepository.save(scheduleEntity);
    if (!savedSchedule) {
      throw new Error('Không thể tạo lịch chạy');
    }

    const fullSchedule = await this.scheduleRepository.findOne({
      where: { id: savedSchedule.id },
      relations: ['route', 'seat_chart'],
    });

    if (!fullSchedule) {
      throw new Error('Không thể lấy thông tin lịch trình sau khi tạo');
    }

    const response: DTO_RP_Schedule = {
      id: fullSchedule.id,
      route_id: fullSchedule.route.id,
      route_name: fullSchedule.route.route_name,
      seat_chart_id: fullSchedule.seat_chart?.id || null,
      seat_chart_name: fullSchedule.seat_chart?.seat_chart_name || null,
      start_time: data.start_time,
      repeat_type: fullSchedule.repeat_type,
      weekdays: data.weekdays,
      odd_even_type: fullSchedule.odd_even_type,
      start_date: data.start_date,
      end_date: data.is_known_end_date ? data.end_date : null,
      is_known_end_date: fullSchedule.is_known_end_date,
      trip_type: fullSchedule.trip_type,
      created_by: fullSchedule.created_by,
      created_at: fullSchedule.created_at.toISOString(),
    };

    console.log('Created schedule:', response);
    return response;
  }

  async getListSchedulesByCompany(id: number): Promise<DTO_RP_Schedule[]> {
    console.log('Received company ID for getListSchedulesByCompany:', id);

    // 1. Validate company exists
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
    });
    if (!existingCompany) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    // 2. Get schedules with relations
    const schedules = await this.scheduleRepository.find({
      where: { company: { id } },
      relations: ['route', 'seat_chart'],
      order: { start_time: 'ASC' },
    });

    if (!schedules?.length) return [];

    // 3. Process response data
    const response: DTO_RP_Schedule[] = schedules.map((schedule) => {
      // Format date to local timezone (Vietnam UTC+7)
      const adjustTimezone = (date: Date) => {
        if (!date) return null;
        return new Date(date.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours for UTC+7
      };

      // Format date to YYYY-MM-DD
      const formatDate = (date: Date | null) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
      };

      const localStartDate = adjustTimezone(schedule.start_date);
      const localEndDate = schedule.end_date
        ? adjustTimezone(schedule.end_date)
        : null;
      const localCreatedAt = adjustTimezone(schedule.created_at);
      const weekdays =
        typeof schedule.weekdays === 'string'
          ? (schedule.weekdays as string).replace(/[{}"]/g, '').split(',')
          : Array.isArray(schedule.weekdays)
            ? schedule.weekdays
            : typeof schedule.weekdays === 'number'
              ? [schedule.weekdays]
              : typeof schedule.weekdays === 'undefined' ||
                  schedule.weekdays === null
                ? []
                : [];

      return {
        id: schedule.id,
        route_id: schedule.route.id,
        route_name: schedule.route.route_name,
        seat_chart_id: schedule.seat_chart?.id || null,
        seat_chart_name: schedule.seat_chart?.seat_chart_name || null,
        start_time: schedule.start_time,
        repeat_type: schedule.repeat_type,
        weekdays,
        odd_even_type: schedule.odd_even_type,
        start_date: formatDate(localStartDate), // Fixed timezone
        end_date: schedule.is_known_end_date ? formatDate(localEndDate) : null, // Fixed timezone
        is_known_end_date: schedule.is_known_end_date,
        trip_type: schedule.trip_type,
        created_by: schedule.created_by,
        created_at: localCreatedAt.toISOString(), // Adjusted to local time
      };
    });

    console.log('Retrieved schedules:', response);
    return response;
  }

  async deleteSchedule(id: number): Promise<void> {
    console.log('Received ID for deleteSchedule:', id);

    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['route', 'seat_chart'],
    });

    if (!schedule) {
      throw new NotFoundException('Lịch chạy không tồn tại');
    }

    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Không thể xóa lịch chạy');
    }

    console.log('Deleted schedule with ID:', id);
  }

  async updateSchedule(
    id: number,
    data: DTO_RQ_UpdateSchedule,
  ): Promise<DTO_RP_Schedule> {
    console.log('Received data for updateSchedule:', { id, data });

    try {
      if (id !== data.id) {
        throw new Error('Dữ liệu lịch chạy không hợp lệ');
      }

      const existingSchedule = await this.scheduleRepository.findOne({
        where: { id },
        relations: ['route', 'seat_chart'],
      });

      if (!existingSchedule) {
        throw new Error('Lịch chạy không tồn tại');
      }

      const updatedSchedule = await this.scheduleRepository.save({
        ...existingSchedule,
        ...data,
      });
      if (!updatedSchedule) {
        throw new Error('Không thể cập nhật lịch chạy');
      }
      const response: DTO_RP_Schedule = {
        id: updatedSchedule.id,
        route_id: updatedSchedule.route_id,
        route_name: updatedSchedule.route?.route_name || '',
        seat_chart_id: updatedSchedule.seat_chart_id,
        seat_chart_name: updatedSchedule.seat_chart?.seat_chart_name || '',
        start_time: updatedSchedule.start_time,
        repeat_type: updatedSchedule.repeat_type,
        weekdays: updatedSchedule.weekdays || [],
        odd_even_type: updatedSchedule.odd_even_type || null,
        start_date: updatedSchedule.start_date,
        end_date: updatedSchedule.end_date || null,
        is_known_end_date: updatedSchedule.is_known_end_date || false,
        trip_type: updatedSchedule.trip_type || 0,
        created_by: updatedSchedule.created_by,
        created_at: updatedSchedule.created_at.toISOString(),
      };

      console.log('Successfully updated schedule:', response);
      return response;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }
}
