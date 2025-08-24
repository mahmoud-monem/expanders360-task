import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;
}
