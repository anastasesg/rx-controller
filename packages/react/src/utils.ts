import { useEffect } from "react";

export function once(action: () => void) {
  useEffect(() => action(), []);
}

export function every(action: () => void, ms: number) {
  useEffect(() => {
    const interval = setInterval(() => action(), ms);
    return () => {
      clearInterval(interval);
    };
  }, []);
}
