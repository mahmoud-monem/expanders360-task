import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * Applies the Swagger decorators auth related to auth
 * Can be used for controllers or controller methods
 *
 * @returns {Function} - the Auth combined decorator
 */
export function ApiAuth(): Function {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: "Not authorized",
    }),
    ApiForbiddenResponse({
      description: "Access is denied",
    }),
  );
}
