import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-app-background/80 backdrop-blur-md border-b border-app-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-text-muted h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for articles, topics, or sources..."
              className="pl-10 bg-app-surface border-app-border text-app-text-primary placeholder:text-app-text-muted"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
          >
            <Plus className="h-4 w-4 mr-2" />
            Submit Link
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}