import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

export class CreateProjectDto {
  @ApiProperty({
    type: Number,
    description: "The ID of the client",
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  clientId: number;

  @ApiProperty({
    type: Number,
    description: "The ID of the country",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  @ApiProperty({
    type: String,
    description: "The services needed for the project",
    enum: ServiceType,
    isArray: true,
    example: [ServiceType.MarketResearch, ServiceType.LegalServices],
  })
  @IsEnum(ServiceType, { each: true })
  @IsArray()
  @IsOptional()
  neededServices: ServiceType[];

  @ApiProperty({
    type: Number,
    description: "The budget for the project",
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @ApiProperty({
    type: String,
    description: "The status of the project",
    enum: ProjectStatus,
    example: ProjectStatus.Pending,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
