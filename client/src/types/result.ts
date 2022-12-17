import { strEnum } from "../utils/strEnum";

export const ErrorCode = ["VALIDATION_ERROR", "INTERNAL_SERVER_ERROR"] as const;

export const EErrorCode = strEnum(ErrorCode);

export type TErrorCode = keyof typeof EErrorCode;

type TError = {
  message: string;
  extensions?: {
    code: TErrorCode;
    [key: string]: unknown;
  };
};

type TResultWithData<T> = {
  data: T;
  errors?: never;
};

type TResultWithErrors = {
  data?: never;
  errors: TError[];
};

export type TResult<T> = TResultWithData<T> | TResultWithErrors;

export type TListenEvent<T> = (result: TResult<T>) => void;
