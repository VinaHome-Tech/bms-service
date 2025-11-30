import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ResponseResult } from "src/shared/response/result";
import { GetAllProvinceNameUseCase } from "../use-cases/super-admin/get-all-province-name.usecase";
import { DTO_RP_GlobalPoint, DTO_RP_Province } from "../dtos/response/point.dto";
import { GetWardsByProvinceCodeUseCase } from "../use-cases/super-admin/get-wards-by-province-code.usecase";
import { CreateGlobalPointUseCase } from "../use-cases/super-admin/create-global-point.usecase";
import { DTO_RQ_GlobalPoint } from "../dtos/request/point.dto";
import { GetAllGlobalPointUseCase } from "../use-cases/super-admin/get-all-global-point.usecase";
import { UpdateGlobalPointUseCase } from "../use-cases/super-admin/update-global-point.usecase";

@Controller('super-admin-point')
export class SuperAdminPointController {
    constructor(
        private readonly getAllProvinceNameUseCase: GetAllProvinceNameUseCase,
        private readonly getWardsByProvinceCodeUseCase: GetWardsByProvinceCodeUseCase,
        private readonly createGlobalPointUseCase: CreateGlobalPointUseCase,
        private readonly getAllGlobalPointUseCase: GetAllGlobalPointUseCase,
        private readonly updateGlobalPointUseCase: UpdateGlobalPointUseCase,
    ) { }

    @Get('provinces')
    async GetAllProvince(): Promise<ResponseResult<DTO_RP_Province[]>> {
        const result = await this.getAllProvinceNameUseCase.execute();
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
    @Get('provinces/:id/wards')
    async GetWardsByProvinceCode(@Param('id') provinceCode: string): Promise<ResponseResult<any>> {
        const result = await this.getWardsByProvinceCodeUseCase.execute(provinceCode);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
    @Post('global-points')
    async CreateGlobalPoint(@Body() data: DTO_RQ_GlobalPoint): Promise<ResponseResult<DTO_RP_GlobalPoint>> {
        console.log('data', data);
        const result = await this.createGlobalPointUseCase.execute(data);
        return new ResponseResult(true, HttpStatus.CREATED, 'Success', result);
    }
    @Get('global-points')
    async GetAllGlobalPoints(): Promise<ResponseResult<DTO_RP_GlobalPoint[]>> {
        const result = await this.getAllGlobalPointUseCase.execute();
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
    @Put('global-points/:id')
    async UpdateGlobalPoint(@Param('id') id: string, @Body() data: DTO_RQ_GlobalPoint): Promise<ResponseResult<DTO_RP_GlobalPoint>> {
        const result = await this.updateGlobalPointUseCase.execute(id, data);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
}