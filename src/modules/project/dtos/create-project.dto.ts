import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

export class CreateProjectDto {
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  @IsArray()
  @IsEnum(ServiceType, { each: true })
  neededServices: ServiceType[];

  @IsNumber()
  @IsPositive()
  budget: number;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus = ProjectStatus.Pending;
}
