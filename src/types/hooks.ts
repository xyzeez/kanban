export type DebouncedFunction<T extends unknown[], R> = (
  signal: AbortSignal,
  ...args: T
) => Promise<R>;
