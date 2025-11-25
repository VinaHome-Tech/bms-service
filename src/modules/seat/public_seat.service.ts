import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SeatChart } from "src/entities/seat_chart.entity";
import { Seat } from "./bms_seat.dto";
import { Repository } from "typeorm";

@Injectable()
export class PublicSeatService {
    constructor(
        @InjectRepository(SeatChart)
        private readonly seatChartRepo: Repository<SeatChart>,
        @InjectRepository(Seat)
        private readonly seatRepo: Repository<Seat>,
    ) { }

    async GetSeatDetailsBySeatChartId(seatChartId: number) {
        const seatChart = await this.seatChartRepo.findOne({
            where: { id: seatChartId },
            relations: ['seats'],
        });
        if (!seatChart) {
            throw new NotFoundException('Dữ liệu sơ đồ ghế không tồn tại');
        }

        return seatChart.seats;
    }
}