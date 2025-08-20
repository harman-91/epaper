import { useRef, useCallback } from 'react';

const useThrottle = (func, delay) => {
  const timeoutRef = useRef(null);

  const throttledFunction = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        return
      }

      if (!timeoutRef.current) {
        // Execute the function immediately on the first call
        func(...args);
      }

      timeoutRef.current = setTimeout(() => {
    
        timeoutRef.current = null;
      }, delay);
    },
    [func, delay]
  );

  return throttledFunction;
};

export default useThrottle;