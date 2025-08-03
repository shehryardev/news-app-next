import { Menu, Bell, Search, User, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/contexts/SearchContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const { searchQuery, setSearchQuery, setIsSearching, clearSearch } =
    useSearch();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = localSearchQuery.trim();
      if (trimmedQuery !== searchQuery) {
        setSearchQuery(trimmedQuery);
        setIsSearching(trimmedQuery.length > 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery, setSearchQuery, setIsSearching]);

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    clearSearch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = localSearchQuery.trim();
      setSearchQuery(query);
      setIsSearching(query.length > 0);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-app-border bg-app-background/95 backdrop-blur supports-[backdrop-filter]:bg-app-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden text-app-text-secondary hover:text-app-text-primary"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-text-secondary h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              // onKeyDown={handleSearchKeyDown}
              className="pl-10 pr-10 bg-app-surface border-app-border text-app-text-primary placeholder:text-app-text-muted focus:bg-app-card focus:border-app-accent/50 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
            />
            {localSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-app-text-secondary hover:text-app-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-app-text-secondary hover:text-app-text-primary"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.picture || undefined}
                    alt={user?.name || user?.email}
                  />
                  <AvatarFallback className="bg-app-surface text-app-text-primary">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-app-card border-app-border w-56"
              align="end"
            >
              <DropdownMenuLabel className="text-app-text-primary">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-app-text-muted">
                    {user?.email}
                  </p>
                  {user?.auth_provider === "google" && (
                    <p className="text-xs text-app-accent">Google Account</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-app-border" />
              <DropdownMenuItem
                onClick={logout}
                className="text-app-text-primary hover:bg-app-surface"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
