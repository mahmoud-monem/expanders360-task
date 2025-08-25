import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCountryDto {
  @ApiProperty({
    type: "string",
    example: "Egypt",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: "string",
    example: "+1",
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    type: "string",
    example: "EG",
  })
  @IsNotEmpty()
  @IsString()
  isoCode: string;

  @ApiProperty({
    type: "string",
    example: "30.123456",
  })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiProperty({
    type: "string",
    example: "30.123456",
  })
  @IsNotEmpty()
  @IsString()
  latitude: string;
}
