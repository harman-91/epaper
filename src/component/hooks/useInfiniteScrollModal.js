import { useEffect, useRef, useCallback } from "react";

export const useInfiniteScrollModal = ({
  loadMore,
  hasMore,
  loading,
  threshold = 0.1,
  bottomOffset = 200,
  rateLimit = 1000, 
  scrollContainerRef, 
}) => {
  const loadMoreRef = useRef(null);
  const lastCallTime = useRef(0);

  const checkAndLoadMore = useCallback(() => {
    if (!hasMore || loading) return;

    const now = Date.now();
    if (now - lastCallTime.current < rateLimit) return; // Apply rate limiting

    lastCallTime.current = now;
    loadMore();
  }, [loadMore, hasMore, loading, rateLimit]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current ;

    if (!scrollContainer) return;

    const onScroll = () => {
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainer === window
          ? {
              scrollTop: window.scrollY,
              scrollHeight: document.documentElement.scrollHeight,
              clientHeight: window.innerHeight,
            }
          : scrollContainer;

      if (scrollHeight - scrollTop - clientHeight <= bottomOffset) {
        checkAndLoadMore();
      }
    };

    scrollContainer.addEventListener("scroll", onScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainerRef, bottomOffset, checkAndLoadMore]);

  return {
    loadMoreRef,
    style: {
      width: "100%",
      height: "10px",
      position: "relative",
      bottom: `${bottomOffset}px`,
    },
  };
};
