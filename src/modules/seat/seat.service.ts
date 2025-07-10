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
    data: DTO_RQ_CreateSeatChart,
  ): Promise<DTO_RP_SeatChart> {
    console.log(data);
    const company = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existingSeatChart = await this.seatChartRepository.findOne({
      where: {
        company: { id: data.company_id },
        seat_chart_name: data.seat_chart_name,
      },
      relations: ['company'],
    });
    if (existingSeatChart) {
      throw new NotFoundException('Sơ đồ ghế đã tồn tại.');
    }

    const newSeatChart = this.seatChartRepository.create({
      seat_chart_name: data.seat_chart_name,
      seat_chart_type: data.seat_chart_type,
      total_floor: data.total_floor,
      total_row: data.total_row,
      total_column: data.total_column,
      created_by: data.created_by,
      company: company,
    });
    const savedSeatChart = await this.seatChartRepository.save(newSeatChart);

    const seatsToCreate = data.seats.map((seat) => ({
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

    return {
      id: savedSeatChart.id,
      seat_chart_name: savedSeatChart.seat_chart_name,
      seat_chart_type: savedSeatChart.seat_chart_type,
      total_floor: savedSeatChart.total_floor,
      total_row: savedSeatChart.total_row,
      total_column: savedSeatChart.total_column,
      created_by: savedSeatChart.created_by,
      created_at: savedSeatChart.created_at,
      company_id: savedSeatChart.company.id,
      seats: savedSeats.map((seat) => ({
        id: seat.id,
        code: seat.code,
        name: seat.name,
        status: seat.status,
        floor: seat.floor,
        row: seat.row,
        column: seat.column,
        type: seat.type,
      })),
    };
  }

  async getSeatChartByCompany(id: number): Promise<DTO_RP_SeatChart[]> {
    const seatCharts = await this.seatChartRepository.find({
      where: { company: { id: id } },
      relations: ['company', 'seats'],
    });

    if (!seatCharts || seatCharts.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy sơ đồ ghế nào cho công ty này.',
      );
    }

    return seatCharts.map((seatChart) => ({
      id: seatChart.id,
      seat_chart_name: seatChart.seat_chart_name,
      seat_chart_type: seatChart.seat_chart_type,
      total_floor: seatChart.total_floor,
      total_row: seatChart.total_row,
      total_column: seatChart.total_column,
      created_by: seatChart.created_by,
      created_at: seatChart.created_at,
      company_id: seatChart.company.id,
      seats: seatChart.seats.map((seat) => ({
        id: seat.id,
        code: seat.code,
        name: seat.name,
        status: seat.status,
        floor: seat.floor,
        row: seat.row,
        column: seat.column,
        type: seat.type,
      })),
    }));
  }

  async deleteSeatChart(id: number): Promise<void> {
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
    data: DTO_RQ_UpdateSeatChart,
  ): Promise<DTO_RP_SeatChart> {
    console.log(data);

    // Lấy thông tin seat chart hiện tại với tất cả seats liên quan
    const seatChart = await this.seatChartRepository.findOne({
      where: { id: id },
      relations: ['company', 'seats'],
    });

    if (!seatChart) {
      throw new NotFoundException('Sơ đồ ghế không tồn tại');
    }

    // Cập nhật thông tin chính của seat chart
    seatChart.seat_chart_name = data.seat_chart_name;
    seatChart.seat_chart_type = data.seat_chart_type;
    seatChart.total_floor = data.total_floor;
    seatChart.total_row = data.total_row;
    seatChart.total_column = data.total_column;
    seatChart.created_by = data.created_by;
    seatChart.created_at = new Date();

    const updatedSeatChart = await this.seatChartRepository.save(seatChart);

    // Lấy danh sách seats hiện tại
    const existingSeats = updatedSeatChart.seats || [];
    const newSeatsData = data.seats || [];

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
      relations: ['company', 'seats'],
    });

    if (!finalSeatChart) {
      throw new NotFoundException(
        'Không thể tải lại thông tin sơ đồ ghế sau khi cập nhật',
      );
    }

    return {
      id: finalSeatChart.id,
      seat_chart_name: finalSeatChart.seat_chart_name,
      seat_chart_type: finalSeatChart.seat_chart_type,
      total_floor: finalSeatChart.total_floor,
      total_row: finalSeatChart.total_row,
      total_column: finalSeatChart.total_column,
      created_by: finalSeatChart.created_by,
      created_at: finalSeatChart.created_at,
      company_id: finalSeatChart.company.id,
      seats: finalSeatChart.seats.map((seat) => ({
        id: seat.id,
        code: seat.code,
        name: seat.name,
        status: seat.status,
        floor: seat.floor,
        row: seat.row,
        column: seat.column,
        type: seat.type,
      })),
    };
  }

  async getSeatChartNameByCompany(id: number): Promise<DTO_RP_SeatChartName[]> {
    const seatCharts = await this.seatChartRepository.find({
      where: { company: { id: id } },
      select: ['id', 'seat_chart_name'],
    });

    if (!seatCharts || seatCharts.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy sơ đồ ghế nào cho công ty này.',
      );
    }

    return seatCharts.map((seatChart) => ({
      id: seatChart.id,
      seat_chart_name: seatChart.seat_chart_name,
    }));
  }
}
