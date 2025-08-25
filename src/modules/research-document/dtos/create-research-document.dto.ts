import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { ApiArrayPropertyOptional } from "src/common/decorators/api-array-property-optional.decorator";

export class CreateResearchDocumentDto {
  @ApiProperty({
    type: String,
    description: "The title of the research document",
    example: "Research Document Title",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: "The content of the research document",
    example: "Research Document Content",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiArrayPropertyOptional({
    type: String,
    description: "The tags of the research document",
    isArray: true,
    example: ["tag1", "tag2"],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    type: Number,
    description: "The project ID of the research document",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  projectId: number;
}
