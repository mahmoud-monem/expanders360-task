import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { Environment } from "../constants/environment.enum";
import { CastStringToBool } from "../decorators/cast-string-to-bool.decorator";

/**
 * Environment variables needed for running application
 */
export class EnvironmentVariables {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  public APP_PORT: number;

  @IsNotEmpty()
  @IsString()
  public APP_HOST: string;

  @IsNotEmpty()
  @IsEnum(Environment)
  public NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  public DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  public DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  public DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  public DB_NAME: string;

  @IsBoolean()
  @IsOptional()
  @CastStringToBool()
  public DB_SSL: boolean = false;

  @IsString()
  @IsOptional()
  public MONGO_URI: string;

  @IsString()
  @IsOptional()
  public JWT_SECRET: string;

  @IsString()
  @IsOptional()
  public SMTP_HOST: string;

  @IsString()
  @IsOptional()
  public SMTP_PORT: string;

  @IsString()
  @IsOptional()
  public SMTP_USER: string;

  @IsString()
  @IsOptional()
  public SMTP_PASS: string;

  @IsString()
  @IsNotEmpty()
  public S3_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  public S3_REGION: string;

  @IsString()
  @IsNotEmpty()
  public S3_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  public S3_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  public S3_BUCKET_NAME: string;
}
