import { TError } from "../../types/error";

type TResultWithData<T> = {
  data: T;
  errors?: never;
};

type TResultWithErrors = {
  data?: never;
  errors: TError[];
};

export type TResult<T> = TResultWithData<T> | TResultWithErrors;

export type TEmitEvent<T> = (result: TResult<T>) => void;
