export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 rounded-lg overflow-hidden">
      <div className="skeleton aspect-[2/3] w-full rounded-lg" />
      <div className="mt-2 skeleton h-3 w-3/4 rounded" />
      <div className="mt-1 skeleton h-2 w-1/2 rounded" />
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className="w-full h-[85vh] skeleton" />
  )
}
