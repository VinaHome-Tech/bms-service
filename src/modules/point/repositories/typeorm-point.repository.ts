import { Repository } from "typeorm";
import { ProvinceOrmEntity } from "../entities/ProvinceOrmEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { PointRepository } from "./point.repository";
import { WardOrmEntity } from "../entities/WardOrmEntity";
import { GlobalPointOrmEntity } from "../entities/GlobalPointOrmEntity.entity";

@Injectable()
export class TypeOrmPointRepository extends PointRepository {
    constructor(
        @InjectRepository(ProvinceOrmEntity)
        private readonly provinceRepo: Repository<ProvinceOrmEntity>,
        @InjectRepository(WardOrmEntity)
        private readonly wardRepo: Repository<WardOrmEntity>,
        @InjectRepository(GlobalPointOrmEntity)
        private readonly globalPointRepo: Repository<GlobalPointOrmEntity>,
    ) {
        super();
    }
    async getAllProvinceName(): Promise<ProvinceOrmEntity[]> {
        return this.provinceRepo.find({
            select: {
                id: true,
                name: true,
                code: true,
            },
        });
    }
    async getWardsByProvinceCode(provinceCode: string): Promise<WardOrmEntity[]> {
        return this.wardRepo.find({
            where: {
                province: {
                    code: provinceCode,
                },
            },
        });
    }


    findByNameGlobalPoint(name: string) {
        return this.globalPointRepo.findOne({ where: { name } });
    }


    findProvinceById(id: string) {
        return this.provinceRepo.findOne({ where: { id } });
    }

    findWardById(id: string) {
        return this.wardRepo.findOne({ where: { id } });
    }

    createGlobalPoint(data: Partial<GlobalPointOrmEntity>) {
        return this.globalPointRepo.save(this.globalPointRepo.create(data));
    }

    findGlobalPointById(id: string) {
        return this.globalPointRepo.findOne({
            where: { id },
            relations: ['province', 'ward'],
            
        });
    }

    getAllGlobalPoints(): Promise<GlobalPointOrmEntity[]> {
        return this.globalPointRepo.find({
            relations: ['province', 'ward'],
            order: { created_at: 'DESC' },
        });
    }
    async updateGlobalPoint(id: string, data: Partial<GlobalPointOrmEntity>): Promise<void> {
        await this.globalPointRepo.update({ id }, data);
    }


}