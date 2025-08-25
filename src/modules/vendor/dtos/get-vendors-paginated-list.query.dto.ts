import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

import { ApiArrayPropertyOptional } from "src/common/decorators/api-array-property-optional.decorator";
import { PaginationQueryDto } from "src/common/dtos/pagination.query.dto";
import { ServiceType } from "src/modules/project/constants/service-type.enum";

export class GetVendorFiltersDto {
  @ApiPropertyOptional({
    name: "filters[supportedCountryId]",
    type: Number,
    description: "The ID of the supported country",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  supportedCountryId?: number;

  @ApiArrayPropertyOptional({
    name: "filters[offeredServices]",
    type: String,
    description: "The services offered by the vendor",
    enum: ServiceType,
    isArray: true,
    example: `${ServiceType.MarketResearch},${ServiceType.LegalServices}`,
  })
  @IsEnum(ServiceType, { each: true })
  @IsArray()
  @IsOptional()
  offeredServices?: ServiceType[];
}

export class GetVendorsPaginatedListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "The search query for the vendor name",
    example: "Vendor 1",
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: "The filters for the vendor list",
    type: GetVendorFiltersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetVendorFiltersDto)
  filters: GetVendorFiltersDto = {};
}
