import { Logger } from "@nestjs/common";
import { ValidationError } from "class-validator";

interface ErrorExtractorConfig {
  maxRecursionLevel?: number;
  logger?: Logger;
}

/**
 * Extracts error messages from validation errors
 *
 * @param {ValidationError[]} errors - validation errors
 * @param {ErrorExtractorConfig} config - config
 * @returns {string[]} - Extracted error messages
 */
export function extractValidationErrorMessages(
  errors: ValidationError[],
  { maxRecursionLevel = 3, logger }: ErrorExtractorConfig = {},
): string[] {
  return errors
    .map(item => fetchConstraintsData(item, 0, maxRecursionLevel))
    .filter(item => {
      const itemHasConstraints = Boolean(item.constraints);

      if (!itemHasConstraints && logger) {
        logger.warn(
          { validationError: item },
          "ValidationError without constraints",
        );
      }
      return itemHasConstraints;
    })
    .flatMap(item =>
      Object.values(item.constraints as { [type: string]: string }),
    );
}

function fetchConstraintsData(
  err: ValidationError,
  nestLevel: number,
  maxRecursionLevel: number,
): ValidationError {
  const result = err.constraints;

  if (nestLevel > maxRecursionLevel) {
    return err;
  }

  if (!result && err.children) {
    nestLevel += 1;
    const childErrors = err.children?.map(childValidationError =>
      fetchConstraintsData(childValidationError, nestLevel, maxRecursionLevel),
    );

    // regarding the docs, the children should never be an empty array
    return childErrors.length > 0 ? childErrors[0] : err;
  }
  return err;
}
