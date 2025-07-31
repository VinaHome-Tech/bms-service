import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DTO_RP_SeatChart,
  DTO_RP_SeatChartName,
  DTO_RQ_CreateSeatChart,
  DTO_RQ_UpdateSeatChart,
} from './seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Repository } from 'typeorm';
import { Seat } from './seat.entity';
import { SeatChart } from './seat_chart.entity';
import { SeatMapper } from './seat.mapper';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createSeatChart(
    user: DTO_RQ_UserAction,
    data_create: DTO_RQ_CreateSeatChart,
  ): Promise<DTO_RP_SeatChart> {
    console.log('User:', user);
    console.log('Data Create:', data_create);

    const existingSeatChart = await this.seatChartRepository.findOne({
      where: {
        company_id: user.company_id,
        seat_chart_name: data_create.seat_chart_name,
      },
    });
    if (existingSeatChart) {
      throw new NotFoundException('Sơ đồ ghế đã tồn tại.');
    }

    const newSeatChart = this.seatChartRepository.create({
      seat_chart_name: data_create.seat_chart_name,
      seat_chart_type: data_create.seat_chart_type,
      total_floor: data_create.total_floor,
      total_row: data_create.total_row,
      total_column: data_create.total_column,
      company_id: user.company_id,
    });
    const savedSeatChart = await this.seatChartRepository.save(newSeatChart);

    const seatsToCreate = data_create.seats.map((seat) => ({
      name: seat.name,
      code: seat.code,
      status: seat.status,
      floor: seat.floor,
      row: seat.row,
      column: seat.column,
      type: seat.type,
      seat_chart: savedSeatChart,
    }));

    const savedSeats = await this.seatRepository.save(seatsToCreate);

    return SeatMapper.toDTO({
      ...savedSeatChart,
      seats: savedSeats,
    });
  }

  async getSeatChartByCompany(id: string): Promise<DTO_RP_SeatChart[]> {
    console.log('Received company ID:', id);
    const seatCharts = await this.seatChartRepository.find({
      where: { company_id: id },
      order: { created_at: 'ASC' },
      relations: ['seats'],
    });

    if (!seatCharts.length) {
      throw new NotFoundException('Không có sơ đồ ghế nào');
    }

    return seatCharts.map((seatChart) => SeatMapper.toDTO(seatChart));
  }

  async deleteSeatChart(id: number, user: DTO_RQ_UserAction): Promise<void> {
    console.log('Delete Seat Chart ID:', id);
    console.log('User:', user);
    const seatChart = await this.seatChartRepository.findOne({
      where: { id: id },
      relations: ['seats'],
    });

    if (!seatChart) {
      throw new NotFoundException('Sơ đồ ghế không tồn tại');
    }

    if (seatChart.seats && seatChart.seats.length > 0) {
      await this.seatRepository.remove(seatChart.seats);
    }
    await this.seatChartRepository.remove(seatChart);
  }

  async updateSeatChart(
    id: number,
    data_update: DTO_RQ_UpdateSeatChart,
  ): Promise<DTO_RP_SeatChart> {
    console.log(data_update);

    // Lấy thông tin seat chart hiện tại với tất cả seats liên quan
    const seatChart = await this.seatChartRepository.findOne({
      where: { id: id },
      relations: ['seats'],
    });

    if (!seatChart) {
      throw new NotFoundException('Sơ đồ ghế không tồn tại');
    }

    // Cập nhật thông tin chính của seat chart
    seatChart.seat_chart_name = data_update.seat_chart_name;
    seatChart.seat_chart_type = data_update.seat_chart_type;
    seatChart.total_floor = data_update.total_floor;
    seatChart.total_row = data_update.total_row;
    seatChart.total_column = data_update.total_column;

    const updatedSeatChart = await this.seatChartRepository.save(seatChart);

    // Lấy danh sách seats hiện tại
    const existingSeats = updatedSeatChart.seats || [];
    const newSeatsData = data_update.seats || [];

    // Tạo map để kiểm tra nhanh
    const existingSeatMap = new Map<string, any>();
    existingSeats.forEach((seat) => {
      existingSeatMap.set(seat.code, seat);
    });

    const newSeatCodeMap = new Map<string, any>();
    newSeatsData.forEach((seat) => {
      newSeatCodeMap.set(seat.code, seat);
    });

    // Xử lý thêm mới và cập nhật
    for (const seatData of newSeatsData) {
      const existingSeat = existingSeatMap.get(seatData.code);

      if (existingSeat) {
        // Cập nhật seat đã tồn tại
        existingSeat.name = seatData.name;
        existingSeat.status = seatData.status;
        existingSeat.floor = seatData.floor;
        existingSeat.row = seatData.row;
        existingSeat.column = seatData.column;
        existingSeat.type = seatData.type;
        await this.seatRepository.save(existingSeat);
      } else {
        // Thêm seat mới
        const newSeat = this.seatRepository.create({
          name: seatData.name,
          code: seatData.code,
          status: seatData.status,
          floor: seatData.floor,
          row: seatData.row,
          column: seatData.column,
          type: seatData.type,
          seat_chart: updatedSeatChart,
        });
        await this.seatRepository.save(newSeat);
      }
    }

    // Xử lý xoá các seat không còn tồn tại trong dữ liệu mới
    for (const existingSeat of existingSeats) {
      if (!newSeatCodeMap.has(existingSeat.code)) {
        await this.seatRepository.remove(existingSeat);
      }
    }

    // Lấy lại thông tin seat chart sau khi cập nhật
    const finalSeatChart = await this.seatChartRepository.findOne({
      where: { id: updatedSeatChart.id },
      relations: ['seats'],
    });

    if (!finalSeatChart) {
      throw new NotFoundException(
        'Không thể tải lại thông tin sơ đồ ghế sau khi cập nhật',
      );
    }

    return SeatMapper.toDTO(finalSeatChart);
  }

  async getSeatChartNameByCompany(id: string): Promise<DTO_RP_SeatChartName[]> {
    const seatCharts = await this.seatChartRepository.find({
      where: { company_id: id },
      select: ['id', 'seat_chart_name'],
    });

    if (!seatCharts || seatCharts.length === 0) {
      throw new NotFoundException('Không tìm thấy sơ đồ ghế nào');
    }

    return seatCharts.map((seatChart) => ({
      id: seatChart.id,
      seat_chart_name: seatChart.seat_chart_name,
    }));
  }
}
