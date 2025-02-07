import { useRef, useCallback } from "react";

// Types
import { DebouncedFunction } from "../types/hooks";

export const useDebounce = <T extends unknown[], R>(
  fn: DebouncedFunction<T, R>,
  delay = 500,
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const controllerRef = useRef<AbortController | null>(null);

  const debouncedFn = useCallback(
    async (...args: T): Promise<R> => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      controllerRef.current = new AbortController();

      return new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await fn(controllerRef.current!.signal, ...args);
            resolve(result);
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
              return;
            }
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        }, delay);
      });
    },
    [fn, delay],
  );

  return debouncedFn;
};
