import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { PaginationResponseDto } from "src/common/dtos/pagination.response.dto";

import { CountryResponseDto } from "./country.response.dto";

export class GetCountriesPaginatedListResponseDto extends PaginationResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: CountryResponseDto,
      isArray: true,
    },
  })
  @Type(() => CountryResponseDto)
  items: CountryResponseDto[];
}
