import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { PaginationQueryDto } from "src/common/dtos/pagination.query.dto";

export class GetCountriesFiltersDto {
  @ApiPropertyOptional({
    description: "The ISO code of the country",
    example: "US",
  })
  @IsString()
  @IsOptional()
  public isoCode?: string;
}

export class GetCountriesPaginatedListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "The search query by name of the country",
    example: "United States",
  })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({
    description: "The filters of the country",
    type: GetCountriesFiltersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetCountriesFiltersDto)
  public filters: GetCountriesFiltersDto = {};
}
