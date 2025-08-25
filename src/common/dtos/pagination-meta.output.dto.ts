import { IPaginationMeta } from "nestjs-typeorm-paginate";

import { ApiPropertyExpose } from "../decorators/api-property-expose.decorator";

/**
 * Pagination related metadata part of every pagination response
 */
export class PaginationMetaResponseDto implements IPaginationMeta {
  constructor(partial?: Partial<PaginationMetaResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The total amount of items matching the filter conditions",
      type: Number,
      example: 100,
    },
  })
  public itemCount: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The total amount of items matching the filter conditions",
      type: Number,
      example: 100,
    },
  })
  public totalItems?: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The requested items per page (i.e., the limit parameter)",
      type: Number,
      example: 10,
    },
  })
  public itemsPerPage: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The total amount of pages (based on the limit)",
      type: Number,
      example: 5,
    },
  })
  public totalPages?: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The current page this paginator `points` to",
      type: Number,
      example: 2,
    },
  })
  public currentPage: number;
}
