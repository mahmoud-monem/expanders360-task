import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

import { ServiceType } from "src/modules/project/constants/service-type.enum";

export class UpdateVendorDto {
  @ApiProperty({
    type: String,
    description: "The name of the vendor",
    example: "Vendor 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    description: "The response SLA hours of the vendor",
    example: 24,
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  responseSlaHours: number;

  @ApiProperty({
    type: Number,
    description: "The rating of the vendor",
    example: 4.5,
  })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    type: Number,
    description: "The supported country IDs of the vendor",
    isArray: true,
    example: [1, 2],
  })
  @IsInt({ each: true })
  @IsArray()
  @IsNotEmpty()
  supportedCountryIds: number[];

  @ApiProperty({
    type: String,
    description: "The services offered by the vendor",
    enum: ServiceType,
    isArray: true,
    example: [ServiceType.MarketResearch, ServiceType.LegalServices],
  })
  @IsEnum(ServiceType, { each: true })
  @IsArray()
  @IsNotEmpty()
  offeredServices: ServiceType[];
}
