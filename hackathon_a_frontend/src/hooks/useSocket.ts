import { useEffect, useLayoutEffect, useRef } from 'react';

// 소켓 대신 REST API 폴링을 사용합니다 (30초 간격)
export const usePolling = (
  callback: () => void | Promise<void>,
  intervalMs: number = 30000,
  enabled: boolean = true
) => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;

    const tick = () => callbackRef.current();

    tick(); // 마운트 시 즉시 1회 실행
    const id = setInterval(tick, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, enabled]);
};
