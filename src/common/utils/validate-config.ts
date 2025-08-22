import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

/**
 * Validates config
 *
 * @param {Record<string, unknown>} config - Existing config to validate
 * @param {ClassConstructor} envDto - Date transfer object describing expected env variables and validation rules
 * @returns {object} - Validated config
 */
export function validateConfig<T>(
  config: Record<string, unknown>,
  envDto: ClassConstructor<T>,
): T {
  const validatedConfig = plainToInstance(envDto, config, {
    exposeDefaultValues: true,
  });

  const errors = validateSync(validatedConfig as object, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errMessages: string[] = [];

    errors.forEach(e => {
      const errConstraints = e.constraints as { [type: string]: string };

      for (const [, errMessage] of Object.entries(errConstraints)) {
        errMessages.push(errMessage);
      }
    });

    throw new Error(
      `Config initialization error: \n${errMessages.join(",\n")}`,
    );
  }

  return validatedConfig;
}
