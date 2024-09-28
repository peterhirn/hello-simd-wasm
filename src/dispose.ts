// @ts-expect-error Polyfill `Symbol.dispose`
Symbol.dispose ??= Symbol("Symbol.dispose");

export type Dispose<T> = Disposable & { value: T };

export const dispose = <T>(value: T, dispose: () => void): Dispose<T> => ({
  value,
  [Symbol.dispose]: dispose
});
