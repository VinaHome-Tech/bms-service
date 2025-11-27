import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { DTO_RP_RouteName } from "../http/response/route-name.response";
import { GetRouteNameListByCompanyIdUseCase } from "../../application/use-cases/get-route-name-list-by-company-id.use-case";
import { Roles } from "src/decorator/roles.decorator";
import { UUIDParam } from "src/param/UUIDParam";
import { TokenGuard } from "src/guards/token.guard";

@Controller('bms-route')
@UseGuards(TokenGuard)
export class BmsRouteController {
    constructor(
        private readonly getRouteNameListByCompanyIdUseCase: GetRouteNameListByCompanyIdUseCase,
    ) { }

    @Get('companies/:id/route-names')
    @Roles('ADMIN', 'STAFF')
    async GetRouteNamesByCompanyId(
        @Param() param: any,
    ): Promise<DTO_RP_RouteName[]> {
        console.log('Fetching route names for company ID:', param.id);
        const result = await this.getRouteNameListByCompanyIdUseCase.execute(param.id);
        return result.map(r => ({ id: r.id, route_name: r.route_name }));
    }
}