import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class TopVendorDto {
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

export class TopVendorWithScoreDto {
  @ApiProperty({ type: TopVendorDto })
  @Type(() => TopVendorDto)
  vendor: TopVendorDto;

  @ApiProperty({ example: 8.75 })
  averageScore: number;
}

export class TopVendorsAnalyticsResponseDto {
  @ApiProperty({ example: "United States" })
  country: string;

  @ApiProperty({ type: [TopVendorWithScoreDto] })
  @Type(() => TopVendorWithScoreDto)
  topVendors: TopVendorWithScoreDto[];

  @ApiProperty({ example: 15 })
  researchDocumentCount: number;
}
