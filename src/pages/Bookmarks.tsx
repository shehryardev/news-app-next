import { AppLayout } from "@/components/layout/AppLayout";
import { BookmarkIcon } from "lucide-react";

const Bookmarks = () => {
  return (
    <AppLayout>
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-app-surface rounded-full flex items-center justify-center mb-6">
          <BookmarkIcon className="h-12 w-12 text-app-text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-app-text-primary mb-4">Your Bookmarks</h1>
        <p className="text-app-text-secondary max-w-md mx-auto">
          Articles you've bookmarked will appear here. Start bookmarking articles to build your reading list!
        </p>
      </div>
    </AppLayout>
  );
};

export default Bookmarks;