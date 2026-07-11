import { Skeleton } from '@/components/ui/skeleton';

/** Route-level loading UI for the PLP — mirrors the grid layout to avoid shift. */
export default function ShopLoading() {
  return (
    <div className="container-page py-8">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-5 w-80" />
      <div className="mt-6 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
        <div>
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-11 w-40" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="mt-3 h-4 w-20" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
