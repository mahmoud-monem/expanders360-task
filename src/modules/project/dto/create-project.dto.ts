import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

export class CreateProjectDto {
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsArray()
  @IsEnum(ServiceType, { each: true })
  servicesNeeded: ServiceType[];

  @IsNumber()
  @IsPositive()
  budget: number;

  @IsEnum(ProjectStatus)
  status?: ProjectStatus = ProjectStatus.Pending;
}
