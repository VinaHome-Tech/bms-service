import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seat } from "src/entities/seat.entity";
import { SeatChart } from "src/entities/seat_chart.entity";
import { In, Not, Repository } from "typeorm";
import { DTO_RQ_SeatChart } from "./bms_seat.dto";

@Injectable()
export class BmsSeatService {
  constructor(
    @InjectRepository(SeatChart)
    private readonly seatChartRepo: Repository<SeatChart>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
  ) { }

  // M4_v2.F1
  async GetListSeatChartByCompanyId(companyId: string) {
    try {
      console.time('GetListSeatChartByCompanyId');
      const seatCharts = await this.seatChartRepo.find({
        where: {
          company_id: companyId,
        },
        relations: [ 'seats' ],
        select: {
          id: true,
          seat_chart_name: true,
          seat_chart_type: true,
          total_floor: true,
          total_row: true,
          total_column: true,
          total_seat: true,
          seats: true,
        },
        order: { id: 'ASC' },
      });
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: seatCharts,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('GetListSeatChartByCompanyId');
    }
  }

  // M4_v2.F2
  async CreateSeatChart(companyId: string, data: DTO_RQ_SeatChart) {
    try {
      console.time('CreateSeatChart');
      const seatChart = await this.seatChartRepo.findOne({
        where: {
          company_id: companyId,
          seat_chart_name: data.seat_chart_name,
        },
      });
      if (seatChart) {
        throw new NotFoundException('Sơ đồ ghế đã tồn tại');
      }
      const newSeatChart = this.seatChartRepo.create({
        seat_chart_name: data.seat_chart_name,
        seat_chart_type: data.seat_chart_type,
        total_floor: data.total_floor,
        total_row: data.total_row,
        total_column: data.total_column,
        total_seat: data.seats.filter((seat) => seat.status === true).length,
        company_id: companyId,
      });
      const savedSeatChart = await this.seatChartRepo.save(newSeatChart);
      const seatsToCreate = data.seats.map((seat) => ({
        name: seat.name,
        code: seat.code,
        status: seat.status,
        floor: seat.floor,
        row: seat.row,
        column: seat.column,
        seat_chart: savedSeatChart,
      }));
      await this.seatRepo.save(seatsToCreate);
      const response = {
        id: savedSeatChart.id,
        seat_chart_name: savedSeatChart.seat_chart_name,
        seat_chart_type: savedSeatChart.seat_chart_type,
        total_floor: savedSeatChart.total_floor,
        total_row: savedSeatChart.total_row,
        total_column: savedSeatChart.total_column,
        total_seat: savedSeatChart.total_seat,
        seats: seatsToCreate,
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: response,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Tạo sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('CreateSeatChart');
    }

  }

  // M4_v2.F3
  async UpdateSeatChart(seatChartId: number, data: DTO_RQ_SeatChart) {
    try {
      console.time('UpdateSeatChart');

      // ✅ Load luôn seats
      const seatChart = await this.seatChartRepo.findOne({
        where: { id: seatChartId },
        relations: [ 'seats' ],
      });

      if (!seatChart) {
        throw new NotFoundException('Sơ đồ ghế không tồn tại');
      }

      seatChart.seat_chart_name = data.seat_chart_name;
      seatChart.seat_chart_type = data.seat_chart_type;
      seatChart.total_floor = data.total_floor;
      seatChart.total_row = data.total_row;
      seatChart.total_column = data.total_column;
      seatChart.total_seat = data.seats.filter((s) => s.status === true).length;

      const updatedSeatChart = await this.seatChartRepo.save(seatChart);

      const existingSeats = seatChart.seats || [];
      const newSeatsData = data.seats || [];

      const existingSeatMap = new Map<string, any>(
        existingSeats.map((s) => [ s.code, s ]),
      );

      const newSeatCodeSet = new Set(newSeatsData.map((s) => s.code));

      const seatsToCreate = [];
      const seatsToUpdate = [];

      for (const seatData of newSeatsData) {
        const existingSeat = existingSeatMap.get(seatData.code);
        if (existingSeat) {
          Object.assign(existingSeat, {
            name: seatData.name,
            status: seatData.status,
            floor: seatData.floor,
            row: seatData.row,
            column: seatData.column,
          });
          seatsToUpdate.push(existingSeat);
        } else {
          seatsToCreate.push(
            this.seatRepo.create({
              name: seatData.name,
              code: seatData.code,
              status: seatData.status,
              floor: seatData.floor,
              row: seatData.row,
              column: seatData.column,
              seat_chart: updatedSeatChart,
            }),
          );
        }
      }

      if (seatsToUpdate.length) await this.seatRepo.save(seatsToUpdate);
      if (seatsToCreate.length) await this.seatRepo.save(seatsToCreate);

      // Xoá ghế không còn trong danh sách
      const codesToKeep = Array.from(newSeatCodeSet);
      await this.seatRepo.delete({
        seat_chart: { id: seatChartId },
        code: Not(In(codesToKeep)),
      });

      const finalSeatChart = await this.seatChartRepo.findOne({
        where: { id: updatedSeatChart.id },
        select: {
          id: true,
          seat_chart_name: true,
          seat_chart_type: true,
          total_floor: true,
          total_row: true,
          total_column: true,
          total_seat: true,
          seats: true,
        },
        relations: [ 'seats' ],
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: finalSeatChart,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Cập nhật sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('UpdateSeatChart');
    }
  }


  // M4_v2.F4
  async DeleteSeatChart(seatChartId: number) {
    try {
      console.time('DeleteSeatChart');
      const seatChart = await this.seatChartRepo.findOne({ where: { id: seatChartId } });
      if (!seatChart) {
        throw new NotFoundException('Sơ đồ ghế không tồn tại');
      }

      await this.seatRepo.delete({ seat_chart: { id: seatChartId } });
      await this.seatChartRepo.delete(seatChartId);

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Xoá sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('DeleteSeatChart');
    }
  }

  // M4_v2.F5
  async GetListSeatChartNameByCompanyId(companyId: string) {
    try {
      console.time('GetListSeatChartNameByCompanyId');
      const seatCharts = await this.seatChartRepo.find({
        where: {
          company_id: companyId,
        },
        select: {
          id: true,
          seat_chart_name: true,
        },
        order: { id: 'ASC' },
      });
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: seatCharts,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách tên sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('GetListSeatChartNameByCompanyId');
    }
  }

}