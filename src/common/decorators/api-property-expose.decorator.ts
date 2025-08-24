import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Expose, ExposeOptions } from "class-transformer";
import { ValidationOptions } from "class-validator";

type ApiPropertyExposeOptions = {
  apiPropertyOptions?: ApiPropertyOptions;
  exposeOptions?: ExposeOptions;
  validationOptions?: ValidationOptions;
};

/**
 * Applies swagger "@ApiProperty" & class-transformer "@Expose" decorators
 * Can be used for response dto classes to guarantee property is present and exposed both in swagger docs and at runtime
 *
 * @param {ApiPropertyExposeOptions} options - api property expose options
 * @returns {Function} - combined ApiProperty & Expose decorator
 */
export function ApiPropertyExpose(options?: ApiPropertyExposeOptions): Function {
  return applyDecorators(ApiProperty(options?.apiPropertyOptions), Expose(options?.exposeOptions));
}
