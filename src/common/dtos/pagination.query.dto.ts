import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Max } from "class-validator";

export const MAX_LIMIT_VALUE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Initial DTO that represents the query params for the paginated request
 *
 * This DTO can be extended when the request requires other query params:
 *
 * @example ```ts
 *  class MyRequestQueryDto extends PaginationQueryDto {
 *    ...
 *  }
 *  ```
 *
 *  In order to override the max value for limit, use the following approach. All decorators must be copied.
 *  @example ```ts
 *  class MyRequestQueryDto extends PaginationQueryDto {
 *
 *   // API decorator
 *   @Max(MY_NEW_MAX_VALUE)
 *   @IsPositive()
 *   @IsInt()
 *   @Type(() => Number)
 *   @IsOptional()
 *   public limit: number = MY_DEFAULT_VALUE;
 *  } ```
 */
export class PaginationQueryInputDto {
  @ApiPropertyOptional({
    description: "The current page",
    example: "1",
    default: 1,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page: number = 1;

  @ApiPropertyOptional({
    description: "The amount of items to be returned",
    example: DEFAULT_PER_PAGE,
    default: DEFAULT_PER_PAGE,
  })
  @Max(MAX_LIMIT_VALUE)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public limit: number = DEFAULT_PER_PAGE;
}
