import { Type } from "class-transformer";

import { ApiPropertyExpose } from "../decorators/api-property-expose.decorator";
import { PaginationMetaResponseDto } from "./pagination-meta.output.dto";

export abstract class PaginationResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The metadata about the paginated response",
      type: PaginationMetaResponseDto,
    },
  })
  @Type(() => PaginationMetaResponseDto)
  declare public meta: PaginationMetaResponseDto;
}
