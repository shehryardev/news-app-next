import { useState, useEffect } from "react";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { apiService, type Article } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NewsFeedProps {
  className?: string;
  trending?: boolean;
}

export function NewsFeed({ className, trending = false }: NewsFeedProps) {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

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
        setLikedArticles(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        await apiService.likeArticle(id);
        setLikedArticles(prev => new Set(prev).add(id));
      }

      // Update local state
      setNews(prev => prev.map(item => 
        item._id === id 
          ? { 
              ...item, 
              like_count: isLiked 
                ? (item.like_count || 0) - 1 
                : (item.like_count || 0) + 1
            }
          : item
      ));
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
    const newsItem = news.find(item => item._id === id);
    if (newsItem) {
      navigator.share?.({
        title: newsItem.title,
        text: newsItem.description,
        url: newsItem.url,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(newsItem.url || '');
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard.",
        });
      });
    }
  };

  const fetchNews = async () => {
    if (!isAuthenticated) return;
    
    try {
      const articles = await apiService.getRecommendations(trending);
      setNews(articles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles.",
        variant: "destructive",
      });
    }
  };

  const fetchLikes = async () => {
    if (!isAuthenticated) return;
    
    try {
      const likes = await apiService.getLikes();
      setLikedArticles(new Set(likes.map(like => like.news_id)));
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([fetchNews(), fetchLikes()]).finally(() => {
        setLoading(false);
      });
    } else {
      setNews([]);
      setLikedArticles(new Set());
    }
  }, [isAuthenticated, trending]);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text-primary">
            {trending ? 'Trending' : 'My Feed'}
          </h1>
          <p className="text-app-text-secondary">
            {trending 
              ? 'Popular articles from the community' 
              : 'Stay updated with the latest in tech'
            }
          </p>
        </div>
        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-app-border text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {!isAuthenticated ? (
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
                <p className="text-app-text-secondary">No articles found</p>
              </div>
            ) : (
              // News items
              news.map((item) => (
                <NewsCard
                  key={item._id}
                  news={{
                    id: item._id,
                    title: item.title,
                    description: item.description || '',
                    image: item.image,
                    source: item.source || 'Unknown',
                    publishedAt: item.publishedAt || new Date().toISOString(),
                    url: item.url || '',
                    tags: item.tags || [],
                    likesCount: item.like_count || 0,
                    isLiked: likedArticles.has(item._id),
                    isBookmarked: false, // TODO: Implement when API is available
                  }}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              ))
            )}
          </div>

          {/* Load More */}
          {!loading && news.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-app-border text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </>
      )}

    </div>
  );
}