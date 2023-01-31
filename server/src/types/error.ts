import { strEnum } from "../utils/strEnum";

export const ErrorCode = ["VALIDATION_ERROR", "INTERNAL_SERVER_ERROR"] as const;

export const EErrorCode = strEnum(ErrorCode);

export type TErrorCode = keyof typeof EErrorCode;

export type TError = {
  message: string;
  extensions?: {
    code: TErrorCode;
    [key: string]: unknown;
  };
};

export interface IWackyRideError {
  errors?: TError[];
}
