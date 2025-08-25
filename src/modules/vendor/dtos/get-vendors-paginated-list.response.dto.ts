import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { PaginationResponseDto } from "src/common/dtos/pagination.response.dto";

import { VendorResponseDto } from "./vendor.response.dto";

export class GetVendorsPaginatedListResponseDto extends PaginationResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: VendorResponseDto,
      isArray: true,
      description: "The vendors",
    },
  })
  @Type(() => VendorResponseDto)
  items: VendorResponseDto[];
}
