import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seat } from "src/entities/seat.entity";
import { SeatChart } from "src/entities/seat_chart.entity";

import { Repository } from "typeorm";

@Injectable()
export class PublicSeatService {
    constructor(
        @InjectRepository(SeatChart)
        private readonly seatChartRepo: Repository<SeatChart>,
        @InjectRepository(Seat)
        private readonly seatRepo: Repository<Seat>,
    ) { }

    async GetSeatDetailsBySeatChartId(seatChartId: string) {
        try {
            const seats = await this.seatRepo.find({
                where: { seat_chart: { id: seatChartId } },
                select: {
                    id: true,
                    code: true,
                    name: true,
                    status: true,
                    floor: true,
                    row: true,
                    column: true,
                },
            });
            return seats;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException("Lấy thông tin sơ đồ ghế thất bại");
        }
    }


}