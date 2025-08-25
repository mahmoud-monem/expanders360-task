import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { PaginationResponseDto } from "src/common/dtos/pagination.response.dto";

import { ProjectResponseDto } from "./project.response.dto";

export class GetProjectsPaginatedListResponseDto extends PaginationResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: ProjectResponseDto,
      isArray: true,
      description: "The projects",
    },
  })
  @Type(() => ProjectResponseDto)
  items: ProjectResponseDto[];
}
