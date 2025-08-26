import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

import { UserRole } from "../../user/constants/user-role.enum";

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: "The name of the user",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: "The email of the user",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    example: "password",
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: "The role of the user",
    example: UserRole.Client,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
