import { useState, useEffect, useCallback } from "react";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Search as SearchIcon } from "lucide-react";
import { apiService, type Article } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/contexts/SearchContext";
import { useToast } from "@/hooks/use-toast";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface NewsFeedProps {
  className?: string;
  trending?: boolean;
}

export function NewsFeed({ className, trending = false }: NewsFeedProps) {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { isAuthenticated } = useAuth();
  const { searchQuery, isSearching } = useSearch();
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 12;

  const handleLike = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like articles.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isLiked = likedArticles.has(id);

      if (isLiked) {
        await apiService.unlikeArticle(id);
        setLikedArticles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        await apiService.likeArticle(id);
        setLikedArticles((prev) => new Set(prev).add(id));
      }

      // Update local state
      setNews((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                like_count: isLiked
                  ? (item.like_count || 0) - 1
                  : (item.like_count || 0) + 1,
              }
            : item
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = (id: string) => {
    // TODO: Implement bookmark functionality when API is available
    toast({
      title: "Coming soon",
      description: "Bookmark functionality will be available soon.",
    });
  };

  const handleShare = (id: string) => {
    const newsItem = news.find((item) => item._id === id);
    if (newsItem) {
      navigator
        .share?.({
          title: newsItem.title,
          text: newsItem.description,
          url: newsItem.url,
        })
        .catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(newsItem.url || "");
          toast({
            title: "Link copied",
            description: "Article link copied to clipboard.",
          });
        });
    }
  };

  const fetchNews = async (pageNum = 0, append = false) => {
    if (!isAuthenticated && !isSearching) return;

    try {
      let articles: Article[] = [];

      if (isSearching && searchQuery) {
        // Use search API
        const skip = pageNum * ITEMS_PER_PAGE;
        const response = await apiService.getArticles(
          searchQuery,
          skip,
          ITEMS_PER_PAGE
        );
        articles = response.results;
      } else if (isAuthenticated) {
        // Use recommendations API
        const skip = pageNum * ITEMS_PER_PAGE;
        articles = await apiService.getRecommendations(
          trending,
          ITEMS_PER_PAGE,
          7,
          skip
        );
      }

      if (append) {
        setNews((prev) => [...prev, ...articles]);
      } else {
        setNews(articles);
      }

      // Check if we have more items
      setHasMore(articles.length === ITEMS_PER_PAGE);

      return articles;
    } catch (error) {
      toast({
        title: "Error",
        description: isSearching
          ? "Failed to search articles."
          : "Failed to fetch articles.",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchLikes = async () => {
    if (!isAuthenticated) return;

    try {
      const likes = await apiService.getLikes();
      setLikedArticles(new Set(likes.map((like) => like.news_id)));
    } catch (error) {
      console.error("Failed to fetch likes:", error);
    }
  };

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const articles = await fetchNews(nextPage, true);
    if (articles && articles.length > 0) {
      setPage(nextPage);
    }
  }, [page, trending, isAuthenticated, isSearching, searchQuery]);

  const { isFetching, lastElementRef } = useInfiniteScroll(
    loadMore,
    hasMore && (isAuthenticated || isSearching),
    { rootMargin: "200px" }
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    await fetchNews(0, false);
    setRefreshing(false);
  };

  // Handle search changes
  useEffect(() => {
    console.log("Search effect triggered:", {
      isSearching,
      searchQuery,
      isAuthenticated,
    });
    if (isSearching && searchQuery) {
      setLoading(true);
      setPage(0);
      setHasMore(true);
      fetchNews(0, false).finally(() => {
        setLoading(false);
      });
    } else if (!isSearching && searchQuery === "") {
      // When search is cleared, reset to feed mode
      console.log("Clearing search, resetting to feed mode");
      if (isAuthenticated) {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        Promise.all([fetchNews(0, false), fetchLikes()]).finally(() => {
          setLoading(false);
        });
      } else {
        setNews([]);
        setPage(0);
        setHasMore(true);
      }
    }
  }, [isSearching, searchQuery, isAuthenticated]);

  // Handle initial load and trending changes (only when not searching)
  useEffect(() => {
    if (!isSearching) {
      if (isAuthenticated) {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        Promise.all([fetchNews(0, false), fetchLikes()]).finally(() => {
          setLoading(false);
        });
      } else {
        setNews([]);
        setLikedArticles(new Set());
        setPage(0);
        setHasMore(true);
      }
    }
  }, [isAuthenticated, trending]);

  const getTitle = () => {
    if (isSearching && searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return trending ? "Trending" : "My Feed";
  };

  const getDescription = () => {
    if (isSearching && searchQuery) {
      return `Found ${news.length} articles matching your search`;
    }
    return trending
      ? "Popular articles from the community"
      : "Stay updated with the latest in tech";
  };

  const shouldShowContent = isAuthenticated || isSearching;

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text-primary flex items-center gap-2">
            {isSearching && <SearchIcon className="h-6 w-6 text-app-accent" />}
            {getTitle()}
          </h1>
          <p className="text-app-text-secondary">{getDescription()}</p>
        </div>
        {shouldShowContent && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-app-border text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        )}
      </div>

      {!shouldShowContent ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-app-text-primary mb-2">
            Sign in to see your personalized feed
          </h2>
          <p className="text-app-text-secondary">
            Create an account to discover articles tailored to your interests
          </p>
        </div>
      ) : (
        <>
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))
            ) : news.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {isSearching ? (
                  <>
                    <SearchIcon className="h-12 w-12 text-app-text-muted mx-auto mb-4" />
                    <p className="text-app-text-secondary text-lg mb-2">
                      No articles found for "{searchQuery}"
                    </p>
                    <p className="text-app-text-muted">
                      Try adjusting your search terms or browse our
                      recommendations
                    </p>
                  </>
                ) : (
                  <p className="text-app-text-secondary">No articles found</p>
                )}
              </div>
            ) : (
              // News items
              news.map((item, index) => {
                const isLastItem = index === news.length - 1;
                return (
                  <div key={item._id} ref={isLastItem ? lastElementRef : null}>
                    <NewsCard
                      news={{
                        id: item._id,
                        title: item.title,
                        description: item.description || "",
                        image: item.image,
                        source: item.source || "Unknown",
                        publishedAt:
                          item.publishedAt || new Date().toISOString(),
                        url: item.url || "",
                        tags: item.tags || [],
                        likesCount: item.like_count || 0,
                        isLiked: likedArticles.has(item._id),
                        isBookmarked: false, // TODO: Implement when API is available
                      }}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onShare={handleShare}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Loading indicator for infinite scroll */}
          {isFetching && (
            <div className="flex justify-center items-center mt-8 py-4">
              <Loader2 className="h-6 w-6 animate-spin text-app-accent mr-2" />
              <span className="text-app-text-secondary">
                Loading more articles...
              </span>
            </div>
          )}

          {/* End of content indicator */}
          {!loading && !isFetching && !hasMore && news.length > 0 && (
            <div className="text-center mt-12 py-8">
              <p className="text-app-text-muted">
                {isSearching
                  ? "No more search results"
                  : "You've reached the end of the feed"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-4 border-app-border text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Feed
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
