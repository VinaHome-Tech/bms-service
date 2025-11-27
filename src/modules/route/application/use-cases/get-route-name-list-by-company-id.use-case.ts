import { CompanyIdVO } from "../../domain/value-objects/company-id.vo";
import { RouteIdVO } from "../../domain/value-objects/route-id.vo";
import { RouteNameMapper } from "../mappers/route-name.mapper";
import { RouteRepositoryPort } from "../ports/route-repository.port";

export class GetRouteNameListByCompanyIdUseCase {
  constructor(private readonly repo: RouteRepositoryPort) { }

  async execute(id: string) {
    const companyId = new CompanyIdVO(id);
    const routes = await this.repo.findByCompanyId(companyId.getValue());

    if (!routes) throw new Error("Route not found");

    return routes.map(r => RouteNameMapper.toResponse(r));
  }
}