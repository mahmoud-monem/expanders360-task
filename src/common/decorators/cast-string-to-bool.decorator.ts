import { Transform } from 'class-transformer';

/**
 * Validates string value. Allowed values are "true"|"false".
 *
 * @returns {PropertyDecorator} transformed value
 * @throws
 */
export function CastStringToBool(): PropertyDecorator {
  return Transform(({ value }: { value: string; key: string }) => {
    if (value.toLowerCase() === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  });
}
