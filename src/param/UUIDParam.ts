import { IsUUID } from "class-validator";

export class UUIDParam {
  @IsUUID()
  id: string;
}