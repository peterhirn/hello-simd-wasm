export interface ResultOk<T> {
  ok: true;
  error: never;
  value: T;
}

export interface ResultError {
  ok: false;
  error: string;
  value: never;
}

export type Result<T = never> = ResultOk<T> | ResultError;

export const ok = <T>(value?: T): ResultOk<T> =>
  ({
    ok: true,
    value
  }) as ResultOk<T>;

export const error = (error: string): ResultError =>
  ({
    ok: false,
    error
  }) as ResultError;

export const valueOrThrow = <T>(result: Result<T>): T => {
  if (result.ok) return result.value;
  throw Error(result.error);
};
