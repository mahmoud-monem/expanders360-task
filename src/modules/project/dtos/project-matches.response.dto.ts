import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { MessageResponseDto } from "src/common/dtos/message.response.dto";

export class VendorDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "TechCorp Solutions" })
  name: string;

  @ApiProperty({ example: ["market_research", "legal_services"] })
  offeredServices: string[];

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: 24 })
  responseSlaHours: number;
}

export class MatchDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: 1 })
  vendorId: number;

  @ApiProperty({ example: 8.5 })
  score: number;

  @ApiProperty({ example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ type: () => VendorDto })
  @Type(() => VendorDto)
  vendor: VendorDto;
}

export class ProjectMatchesResponseDto extends MessageResponseDto {
  @ApiProperty({ type: [MatchDto] })
  @Type(() => MatchDto)
  matches: MatchDto[];

  @ApiProperty({ example: 5 })
  totalMatches: number;
}
