import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchResearchDocumentDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  projectId?: number;
}
