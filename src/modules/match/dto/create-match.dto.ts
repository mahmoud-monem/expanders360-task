import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateMatchDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsNumber()
  @IsNotEmpty()
  vendorId: number;

  @IsNumber()
  @IsPositive()
  score: number;
}
