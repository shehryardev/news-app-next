import { AppLayout } from "@/components/layout/AppLayout";
import { BookmarkIcon, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const Bookmarks = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-app-text-primary">
            Your Bookmarks
          </h1>
          <p className="text-app-text-secondary mt-2">
            Save and organize your favorite articles
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="p-12 bg-app-surface border-app-border">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-app-background rounded-full flex items-center justify-center mb-6 border border-app-border">
              <div className="relative">
                <BookmarkIcon className="h-10 w-10 text-app-text-muted" />
                <Sparkles className="h-6 w-6 text-blue-500 absolute -top-1 -right-1" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-app-text-primary mb-4">
              Bookmarks Coming Soon
            </h2>

            <p className="text-app-text-secondary max-w-md mx-auto mb-6">
              We're building an amazing bookmarking system to help you save and
              organize your favorite articles. This feature will be available in
              the next release!
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-app-text-muted">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>In Development</span>
              </div>
              <div className="hidden sm:block">•</div>
              <span>Expected in v2.0</span>
            </div>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              📚 Smart Collections
            </h3>
            <p className="text-app-text-muted text-sm">
              Organize bookmarks into custom collections and folders
            </p>
          </Card>

          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              🔍 Advanced Search
            </h3>
            <p className="text-app-text-muted text-sm">
              Find saved articles quickly with tags, date filters, and full-text
              search
            </p>
          </Card>

          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              📱 Sync Across Devices
            </h3>
            <p className="text-app-text-muted text-sm">
              Access your bookmarks seamlessly across all your devices
            </p>
          </Card>

          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              📤 Export & Share
            </h3>
            <p className="text-app-text-muted text-sm">
              Export your reading lists and share collections with others
            </p>
          </Card>
        </div>

        {/* Temporary Message */}
        <div className="mt-8 text-center">
          <p className="text-app-text-muted text-sm">
            In the meantime, you can use your browser's bookmark feature to save
            interesting articles!
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
