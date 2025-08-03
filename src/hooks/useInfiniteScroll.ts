import { useCallback, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  isFetching: boolean;
  setIsFetching: (fetching: boolean) => void;
  lastElementRef: (node: HTMLDivElement) => void;
}

export function useInfiniteScroll(
  onLoadMore: () => Promise<void>,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 1.0, rootMargin = '100px' } = options;
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isFetching) {
            setIsFetching(true);
            onLoadMore().finally(() => {
              setIsFetching(false);
            });
          }
        },
        {
          threshold,
          rootMargin,
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, onLoadMore, threshold, rootMargin]
  );

  return {
    isFetching,
    setIsFetching,
    lastElementRef,
  };
} 