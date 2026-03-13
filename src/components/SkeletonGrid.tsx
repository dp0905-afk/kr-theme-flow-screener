export const SkeletonGrid = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-48 rounded-2xl bg-stone-200 animate-pulse" />
    ))}
  </div>
);
