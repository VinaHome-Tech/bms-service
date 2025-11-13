import { IsUUID } from "class-validator";

export class CompanyIdParam {
  @IsUUID()
  id: string;
}