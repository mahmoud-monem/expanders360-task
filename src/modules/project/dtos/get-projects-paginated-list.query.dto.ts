import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

import { ApiArrayPropertyOptional } from "src/common/decorators/api-array-property-optional.decorator";
import { PaginationQueryDto } from "src/common/dtos/pagination.query.dto";

import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

export class GetProjectFiltersDto {
  @ApiPropertyOptional({
    name: "filters[clientId]",
    type: Number,
    description: "The ID of the client",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  clientId?: number;

  @ApiPropertyOptional({
    name: "filters[countryId]",
    type: Number,
    description: "The ID of the country",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  countryId?: number;

  @ApiArrayPropertyOptional({
    name: "filters[neededServices]",
    type: String,
    description: "The services needed for the project",
    enum: ServiceType,
    isArray: true,
    example: `${ServiceType.MarketResearch},${ServiceType.LegalServices}`,
  })
  @IsEnum(ServiceType, { each: true })
  @IsArray()
  @IsOptional()
  neededServices?: ServiceType[];

  @ApiPropertyOptional({
    name: "filters[status]",
    enum: ProjectStatus,
    description: "The status of the project",
    example: ProjectStatus.Active,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}

export class GetProjectsPaginatedListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "The search query for project details",
    example: "market research",
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: "The filters for the project list",
    type: GetProjectFiltersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetProjectFiltersDto)
  filters: GetProjectFiltersDto = {};
}
