import { Injectable } from "@nestjs/common";
import { RouteRepositoryPort } from "../../application/ports/route-repository.port";
import { InjectRepository } from "@nestjs/typeorm";
import { RouteOrmEntity } from "../orm/route.orm-entity";
import { Repository } from "typeorm";
import { RouteName } from "../../domain/entities/route-name.entity";

@Injectable()
export class RouteRepository implements RouteRepositoryPort {
    constructor(
        @InjectRepository(RouteOrmEntity)
        private readonly ormRepo: Repository<RouteOrmEntity>
    ) { }

    async findByCompanyId(id: string): Promise<RouteName[]> {
        const record = await this.ormRepo.find({ where: { company_id: id } });
        return record.map(r => new RouteName(r.id, r.route_name));
    }
}