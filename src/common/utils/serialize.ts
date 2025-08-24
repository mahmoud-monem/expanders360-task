import { ClassConstructor, plainToInstance } from "class-transformer";

/**
 * Serialize data object into given dto class
 *
 * @template T - expected dto class
 * @template K - expected data type
 * @param {ClassConstructor} dto - source class
 * @param {K} data - data to be serialized
 * @returns {T} - serialized data
 */
export function serialize<T, K>(dto: ClassConstructor<T>, data: K): T {
  return plainToInstance(dto, data, { excludeExtraneousValues: true });
}
