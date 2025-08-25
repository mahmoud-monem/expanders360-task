import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

import { ApiArrayPropertyOptional } from "src/common/decorators/api-array-property-optional.decorator";
import { PaginationQueryDto } from "src/common/dtos/pagination.query.dto";

export class GetResearchDocumentFiltersDto {
  @ApiPropertyOptional({
    name: "filters[projectId]",
    type: Number,
    description: "The ID of the project",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  projectId?: number;

  @ApiArrayPropertyOptional({
    name: "filters[tags]",
    type: String,
    description: "Tags to filter documents",
    isArray: true,
    example: "market-research,germany",
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    name: "filters[hasFile]",
    type: Boolean,
    description: "Filter documents with or without files",
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  hasFile?: boolean;
}

export class GetResearchDocumentsPaginatedListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "The search query for document title and content",
    example: "market research",
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: "The filters for the research document list",
    type: GetResearchDocumentFiltersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetResearchDocumentFiltersDto)
  filters: GetResearchDocumentFiltersDto = {};
}
