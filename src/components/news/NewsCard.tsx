import { useState } from "react";
import { Heart, ExternalLink, Bookmark, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  source: string;
  publishedAt: string;
  url: string;
  tags: string[];
  likesCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface NewsCardProps {
  news: NewsItem;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function NewsCard({ news, onLike, onBookmark, onShare }: NewsCardProps) {
  const [liked, setLiked] = useState(news.isLiked || false);
  const [bookmarked, setBookmarked] = useState(news.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(news.likesCount || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(news.id);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(news.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <article className="news-card rounded-xl p-6 group cursor-pointer">
      {/* Image */}
      {news.image && (
        <div className="relative mb-4 overflow-hidden rounded-lg bg-app-border">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {news.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-app-accent-muted text-primary text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-app-text-primary line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>

        {/* Description */}
        <p className="text-app-text-secondary text-sm line-clamp-3 leading-relaxed">
          {news.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-app-text-muted">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-app-text-secondary">{news.source}</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(news.publishedAt)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-app-text-muted hover:text-app-text-primary"
            onClick={() => window.open(news.url, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-app-border">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "btn-like h-8 px-3 text-xs",
                liked
                  ? "text-red-500 hover:text-red-400"
                  : "text-app-text-muted hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4 mr-1", liked && "fill-current")} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={cn(
                "h-8 px-3 text-xs transition-colors",
                bookmarked
                  ? "text-yellow-500 hover:text-yellow-400"
                  : "text-app-text-muted hover:text-yellow-500"
              )}
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(news.id)}
            className="h-8 px-3 text-xs text-app-text-muted hover:text-app-text-primary"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}