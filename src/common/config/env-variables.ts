import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Environment } from '../constants/environment.enum';
import { CastStringToBool } from '../decorators/cast-string-to-bool.decorator';

/**
 * Environment variables needed for running application
 */
export class EnvironmentVariables {
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
}
