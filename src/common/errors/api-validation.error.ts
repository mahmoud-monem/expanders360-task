import { Logger } from "@nestjs/common";
import { ValidationError } from "class-validator";

import { extractValidationErrorMessages } from "../utils/extract-validation-error-messages";

/**
 * Error is supposed to thrown in case of bad request. Is mapped to 400 status code
 */
export class ApiValidationError extends Error {
  private readonly logger: Logger = new Logger(this.constructor.name);

  private readonly recursionLevelForErrorConstraints = 4;

  public errorMessages: string[];

  constructor(private readonly errors: Array<ValidationError | string>) {
    super("ValidationError");

    this.name = this.constructor.name;

    this.errorMessages = this.extractErrorMessagges();

    this.message = this.errorMessages.join(", ");
  }

  /**
   * Extracts error messages for response
   *
   * @returns {Array<string>} - Extracted error messages
   */
  private extractErrorMessagges(): string[] {
    if (
      // either we get a proper ValidationError instance
      this.errors.every(elem => elem instanceof ValidationError) ||
      // or duck-typing of the expected shape :)
      this.errors.every(elem => this.isValidationErrorLike(elem))
    ) {
      return extractValidationErrorMessages(this.errors, {
        maxRecursionLevel: this.recursionLevelForErrorConstraints,
        logger: this.logger,
      });
    }
    if (this.errors.every(elem => typeof elem === "string")) {
      return this.errors;
    }
    throw new Error("Cannot extract error messages, invalid types");
  }

  /**
   * Determine if an object that is NOT instanceof ValidationError still satisfies the object shape
   *
   * @param {object} err - an object that potentially satisfies the type of ValidationError
   * @returns {boolean} err is/not of ValidationError type
   */
  private isValidationErrorLike(err: object | string): err is ValidationError {
    if (typeof err === "string") {
      return false;
    }
    return "property" in err && ("children" in err || "constraints" in err);
  }
}
