import { OfficeOrmEntity } from "../../entities/OfficeOrmEntity";

export abstract class BmsOfficeRepository {
    abstract findOneByCompanyAndName(companyId: string, name: string): Promise<OfficeOrmEntity>;
    abstract findOneByCompanyAndCode(companyId: string, code: string): Promise<OfficeOrmEntity>;
    abstract saveOffice(office: OfficeOrmEntity): Promise<OfficeOrmEntity>;
    abstract findOneByCompanyAndNameOrCode(companyId: string, name: string, code: string): Promise<OfficeOrmEntity>;
    abstract findAllByCompanyId(companyId: string): Promise<OfficeOrmEntity[]>;
    abstract findById(officeId: string): Promise<OfficeOrmEntity>;

    abstract deletePhonesNotInList(
        officeId: string,
        keepPhoneIds: string[],
    ): Promise<void>;

    abstract deleteOffice(officeId: string): Promise<void>;
}