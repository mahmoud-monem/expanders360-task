import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

import { ServiceType } from "../../project/constants/service-type.enum";

export class CreateVendorDto {
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
    description: "The countries supported by the vendor",
    isArray: true,
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  supportedCountryIds: number[];

  @ApiProperty({
    type: String,
    description: "The services offered by the vendor",
    enum: ServiceType,
    isArray: true,
    example: [ServiceType.MarketResearch, ServiceType.LegalServices],
  })
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  @IsNotEmpty()
  offeredServices: ServiceType[];

  @ApiProperty({
    type: Number,
    description: "The response SLA hours of the vendor",
    example: 24,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  responseSlaHours: number;
}
