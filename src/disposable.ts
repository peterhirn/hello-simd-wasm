// @ts-expect-error Polyfill `Symbol.dispose`
Symbol.dispose ??= Symbol("Symbol.dispose");

export type DisposableValue<T> = Disposable & { value: T };

export const disposable = <T>(value: T, dispose: () => void): DisposableValue<T> => ({
  value,
  [Symbol.dispose]: dispose
});
