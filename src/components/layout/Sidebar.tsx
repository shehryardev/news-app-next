import {
  Home,
  TrendingUp,
  Bookmark,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "My Feed", url: "/", icon: Home },
  { title: "Popular", url: "/popular", icon: TrendingUp },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  isOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "bg-app-surface border-r border-app-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-app-border">
        {!collapsed && (
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-app-primary to-app-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-app-text-primary">NewsHub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(!collapsed)}
          className="text-app-text-secondary hover:text-app-text-primary hover:bg-app-accent-muted"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
              "hover:bg-app-accent-muted",
              isActive(item.url)
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-app-text-secondary hover:text-app-text-primary"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="absolute bottom-4 left-4 right-4">
        <div
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg",
            "hover:bg-app-accent-muted cursor-pointer transition-all duration-200",
            "border border-app-border"
          )}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-app-text-primary truncate">
                Welcome, Developer!
              </p>
              <p className="text-xs text-app-text-muted truncate">
                Sign in to customize
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
