import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { PaginationResponseDto } from "src/common/dtos/pagination.response.dto";

import { ResearchDocumentResponseDto } from "./research-document.response.dto";

export class GetResearchDocumentsPaginatedListResponseDto extends PaginationResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: ResearchDocumentResponseDto,
      isArray: true,
      description: "The research documents",
    },
  })
  @Type(() => ResearchDocumentResponseDto)
  items: ResearchDocumentResponseDto[];
}
