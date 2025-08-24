import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from "class-validator";

import { ServiceType } from "../../project/constants/service-type.enum";

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  countriesSupported: string[];

  @IsArray()
  @IsEnum(ServiceType, { each: true })
  servicesOffered: ServiceType[];

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNumber()
  @IsPositive()
  responseSlaHours: number;
}
