import { AppLayout } from "@/components/layout/AppLayout";
import { NewsFeed } from "@/components/news/NewsFeed";

const Popular = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-app-text-primary mb-4">Popular Today</h1>
          <p className="text-app-text-secondary">Trending articles from the developer community</p>
        </div>
        <NewsFeed />
      </div>
    </AppLayout>
  );
};

export default Popular;