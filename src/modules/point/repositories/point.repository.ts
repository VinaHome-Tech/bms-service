import { GlobalPointOrmEntity } from "../entities/GlobalPointOrmEntity.entity";
import { ProvinceOrmEntity } from "../entities/ProvinceOrmEntity";
import { WardOrmEntity } from "../entities/WardOrmEntity";

export abstract class PointRepository {
    abstract getAllProvinceName(): Promise<ProvinceOrmEntity[]>;
    abstract getWardsByProvinceCode(provinceCode: string): Promise<WardOrmEntity[]>;

    abstract findByNameGlobalPoint(name: string): Promise<GlobalPointOrmEntity | null>;
    abstract findByShortNameGlobalPoint(shortName: string): Promise<GlobalPointOrmEntity | null>;
    abstract findProvinceById(id: string): Promise<ProvinceOrmEntity | null>;
    abstract findWardById(id: string): Promise<WardOrmEntity | null>;

    abstract createGlobalPoint(data: Partial<GlobalPointOrmEntity>): Promise<GlobalPointOrmEntity>;
    abstract findGlobalPointById(id: string): Promise<GlobalPointOrmEntity | null>;

    abstract getAllGlobalPoints(): Promise<GlobalPointOrmEntity[]>;
    abstract updateGlobalPoint(id: string, data: Partial<GlobalPointOrmEntity>): Promise<void>;

}