import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional, ApiPropertyOptions } from "@nestjs/swagger";
import { SchemaObjectMetadata } from "@nestjs/swagger/dist/interfaces/schema-object-metadata.interface";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

/**
 * Workaround to the query parameters array serialization
 * [issue](https://github.com/nestjs/swagger/issues/804):
 *
 * Add special `style` and `explode` properties according
 * to the Swagger Parameters serialization specification:
 *
 * @see https://swagger.io/docs/specification/serialization/
 * @see https://swagger.io/docs/specification/serialization/#query
 */
export enum SwaggerQueryParamStyle {
  CSV = "form",
  SPACE = "spaceDelimited",
  PIPE = "pipeDelimited",
}

export const SwaggerStyleSeparators: Record<SwaggerQueryParamStyle, string> = {
  [SwaggerQueryParamStyle.CSV]: ",",
  [SwaggerQueryParamStyle.SPACE]: " ",
  [SwaggerQueryParamStyle.PIPE]: "|",
};

type MapperFn = (value: string, index?: number, array?: string[]) => number | string;

/**
 * Optional swagger property decorator to handle specific array comma separated values passed through query
 *
 * @param {ApiPropertyOptions} options - Api property options
 * @param {SwaggerQueryParamStyle} style - the separator style that swagger can use
 * @param {SchemaObjectMetadata["type"]} valuesType - the mapping type
 * @param {(value: string, index?: number, array?: string[]) => string} mapperFn - the function used to do the mapping
 *
 * @returns {void}
 */
export const ApiArrayPropertyOptional = (
  options: ApiPropertyOptions = {},
  style: SwaggerQueryParamStyle = SwaggerQueryParamStyle.CSV,
  valuesType: SchemaObjectMetadata["type"] = [String],
  mapperFn: MapperFn = _ => _.trim(),
): PropertyDecorator => {
  const swaggerProps = {
    type: valuesType,
    style,
    explode: false,
    ...options,
  } as unknown as ApiPropertyOptions;

  return applyDecorators(
    ApiPropertyOptional(swaggerProps),
    IsOptional(),
    Transform(({ value }: { value: string }) => transformValue(value, style, mapperFn)),
  );
};

/**
 * Transform a string to an array of string
 *
 * @param {string} value - The value
 * @param {SwaggerQueryParamStyle} style - The swagger query param style
 * @param {MapperFn} mapperFn - The mapper function
 * @returns {Array<string>} - The transformed value
 */
export function transformValue(value: string, style: SwaggerQueryParamStyle, mapperFn: MapperFn) {
  if (typeof value !== "string") {
    return value;
  }

  return value.split(SwaggerStyleSeparators[style]).filter(Boolean).map(mapperFn);
}
