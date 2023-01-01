import { ValidationError } from "sequelize";
import { EErrorCode, IWackyRideError, TError } from "../../types/error";
import { TResultWithErrors } from "../@types/result";

export class WackyRideError extends Error implements IWackyRideError {
  readonly errors?: TError[];

  constructor(message: string, errors?: TError[]) {
    super(message);

    this.errors = errors;
  }

  public toResult(): TResultWithErrors {
    if (this.errors) {
      return { errors: this.errors };
    }

    return { errors: [{ message: this.message }] };
  }

  static fromValidationError(validationError: ValidationError): WackyRideError {
    const errors = validationError.errors.reduce<TError[]>(
      (accumulator, { path, message }) => {
        if (path) {
          const error = {
            message,
            extensions: { code: EErrorCode.VALIDATION_ERROR, path },
          };

          return accumulator.concat(error);
        }

        return accumulator;
      },
      []
    );

    return new WackyRideError("Validation error", errors);
  }
}
