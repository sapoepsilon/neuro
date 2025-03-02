import { Skeleton } from "@/components/ui/skeleton";

export function MarketAnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-3/4 mb-6" />
        
        {/* Summary section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        
        {/* Key Competitors section */}
        <Skeleton className="h-6 w-1/3 mt-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/5" />
        
        {/* Market Trends section */}
        <Skeleton className="h-6 w-1/3 mt-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/5" />
        
        {/* Market Opportunities section */}
        <Skeleton className="h-6 w-1/3 mt-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/5" />
        
        {/* Market Size section */}
        <Skeleton className="h-6 w-1/3 mt-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        
        {/* Recommendations section */}
        <Skeleton className="h-6 w-1/3 mt-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/5" />
        
        {/* Sources section */}
        <Skeleton className="h-6 w-1/4 mt-8" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
