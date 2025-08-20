// useInfiniteScroll.js
import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = ({ 
  loadMore, 
  hasMore, 
  loading, 
  threshold = 0.1,
  bottomOffset = 200,
  rateLimit = 1000 // Rate limit in milliseconds (1 second)
}) => {
  const loadMoreRef = useRef(null);
  const lastScrollY = useRef(0);
  const lastCallTime = useRef(0);

  const checkAndLoadMore = useCallback(() => {
    const now = Date.now();
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        loadMore();
        lastCallTime.current = now;
      }
      lastScrollY.current = currentScrollY;
    
  }, [loadMore, rateLimit]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        checkAndLoadMore();
      }
    }, options);

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, threshold, checkAndLoadMore]);

  return {
    loadMoreRef,
    style: {
      width: '100%',
      height: '10px',
      position: 'relative',
      bottom: `${bottomOffset}px`
    }
  };
};