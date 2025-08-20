import { useRef, useCallback } from "react";

const useThrottle = (func, delay) => {
  const timeoutRef = useRef(null);

  const throttledFunction = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        return;
      }

      if (!timeoutRef.current) {
        func(...args);
      }

      timeoutRef.current = setTimeout(() => {
        // Execute the function after the delay
        timeoutRef.current = null;
      }, delay);
    },
    [func, delay]
  );

  return throttledFunction;
};

export default useThrottle;
