import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedule } from "src/entities/schedule.entity";
import { Repository } from "typeorm";

@Injectable()
export class PublicScheduleService {
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
    ) { }

    async GetSchedulesByCompanyAndRoute(companyId: string, routeId: number) {
        const schedule = await this.scheduleRepository.find({
            where: {
                company_id: companyId,
                route: { id: routeId },
            },
            relations: ['route', 'seat_chart'],
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
                }
            }
        });

        return schedule;
    }
}