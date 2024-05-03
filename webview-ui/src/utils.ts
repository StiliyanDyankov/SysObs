import { useCallback, useRef } from "react";

export function useEventCallback<T extends (...args: any[]) => any>(
  handler: T,
) {
  const handlerRef = useRef<T>(handler);

  handlerRef.current = handler;

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return handlerRef.current(...args);
  }, []);
}
