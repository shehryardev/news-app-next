import { useState, useEffect } from "react";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Mock data for demonstration
const mockNews = [
  {
    id: "1",
    title: "React 19 Released: New Features and Breaking Changes You Need to Know",
    description: "The React team has officially released React 19 with major improvements to server components, concurrent features, and developer experience. This comprehensive guide covers all the new features, breaking changes, and migration strategies.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    source: "React Blog",
    publishedAt: "2024-01-15T10:30:00Z",
    url: "https://react.dev",
    tags: ["React", "JavaScript", "Frontend"],
    likesCount: 127,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    title: "The Future of Web Development: WebAssembly and Beyond",
    description: "Exploring how WebAssembly is revolutionizing web performance and enabling new possibilities for web applications. From gaming to data processing, WASM is changing what's possible in the browser.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop",
    source: "TechCrunch",
    publishedAt: "2024-01-15T08:15:00Z",
    url: "https://techcrunch.com",
    tags: ["WebAssembly", "Performance", "Web"],
    likesCount: 89,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    title: "TypeScript 5.3: New Features and Performance Improvements",
    description: "The latest TypeScript release brings significant performance improvements and new language features that make development more efficient and type-safe.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    source: "TypeScript Blog",
    publishedAt: "2024-01-14T16:45:00Z",
    url: "https://typescriptlang.org",
    tags: ["TypeScript", "JavaScript", "Development"],
    likesCount: 203,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "4",
    title: "Building Scalable Microservices with Node.js and Docker",
    description: "A comprehensive guide to designing and implementing microservices architecture using Node.js and Docker. Learn best practices for service communication, data management, and deployment.",
    source: "Dev.to",
    publishedAt: "2024-01-14T14:20:00Z",
    url: "https://dev.to",
    tags: ["Node.js", "Microservices", "Docker"],
    likesCount: 156,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use Each Layout Method",
    description: "Understanding the differences between CSS Grid and Flexbox, and knowing when to use each layout method for optimal responsive design results.",
    image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=400&h=200&fit=crop",
    source: "CSS-Tricks",
    publishedAt: "2024-01-14T11:30:00Z",
    url: "https://css-tricks.com",
    tags: ["CSS", "Layout", "Design"],
    likesCount: 74,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "6",
    title: "AI-Powered Code Review: The Next Evolution in Development",
    description: "How artificial intelligence is transforming code review processes, catching bugs earlier, and improving code quality across development teams.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    source: "GitHub Blog",
    publishedAt: "2024-01-13T19:15:00Z",
    url: "https://github.blog",
    tags: ["AI", "Code Review", "Productivity"],
    likesCount: 312,
    isLiked: true,
    isBookmarked: true,
  },
];

interface NewsFeedProps {
  className?: string;
}

export function NewsFeed({ className }: NewsFeedProps) {
  const [news, setNews] = useState(mockNews);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLike = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            isLiked: !item.isLiked,
            likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1
          }
        : item
    ));
  };

  const handleBookmark = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isBookmarked: !item.isBookmarked }
        : item
    ));
  };

  const handleShare = (id: string) => {
    const newsItem = news.find(item => item.id === id);
    if (newsItem) {
      navigator.share?.({
        title: newsItem.title,
        text: newsItem.description,
        url: newsItem.url,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(newsItem.url);
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  useEffect(() => {
    // Simulate initial loading
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text-primary">My Feed</h1>
          <p className="text-app-text-secondary">Stay updated with the latest in tech</p>
        </div>
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
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))
        ) : (
          // News items
          news.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-app-border text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
}