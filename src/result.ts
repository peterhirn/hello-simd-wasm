export interface ResultOk<T> {
  success: true;
  error: never;
  value: T;
}

export interface ResultError {
  success: false;
  error: string;
  value: never;
}

export type Result<T> = ResultOk<T> | ResultError;

export const ok = <T>(value: T): ResultOk<T> =>
  ({
    success: true,
    value
  }) as ResultOk<T>;

export const error = (error: string): ResultError =>
  ({
    success: false,
    error
  }) as ResultError;

export const valueOrThrow = <T>(result: Result<T>): T => {
  if (result.success) return result.value;
  throw Error(result.error);
};
