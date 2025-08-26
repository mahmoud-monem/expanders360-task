import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

export class CreateProjectDto {
  @ApiProperty({
    type: Number,
    description: "The ID of the client",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
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
    type: [String],
    description: "The services needed for the project",
    example: ["market_research", "legal_services"],
  })
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  neededServices: ServiceType[];

  @ApiProperty({
    type: Number,
    description: "The budget for the project",
    example: 10000,
  })
  @IsNumber()
  @IsPositive()
  budget: number;

  @ApiProperty({
    type: String,
    description: "The status of the project",
    example: ProjectStatus.Pending,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus = ProjectStatus.Pending;
}
