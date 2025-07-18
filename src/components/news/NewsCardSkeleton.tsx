import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-6 space-y-4">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48 rounded-lg bg-app-border" />
      
      {/* Tags skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full bg-app-border" />
        <Skeleton className="h-5 w-20 rounded-full bg-app-border" />
        <Skeleton className="h-5 w-14 rounded-full bg-app-border" />
      </div>
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-full bg-app-border" />
        <Skeleton className="h-6 w-3/4 bg-app-border" />
      </div>
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-app-border" />
        <Skeleton className="h-4 w-full bg-app-border" />
        <Skeleton className="h-4 w-2/3 bg-app-border" />
      </div>
      
      {/* Meta skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-3 w-20 bg-app-border" />
          <Skeleton className="h-3 w-16 bg-app-border" />
        </div>
        <Skeleton className="h-6 w-6 bg-app-border" />
      </div>
      
      {/* Actions skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-app-border">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-8 w-12 bg-app-border" />
          <Skeleton className="h-8 w-8 bg-app-border" />
        </div>
        <Skeleton className="h-8 w-8 bg-app-border" />
      </div>
    </div>
  );
}