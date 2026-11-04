import { Skeleton, SkeletonGroup } from "./skeleton";

export default function SkeletonDemo() {
  return (
    <SkeletonGroup
      label="Loading project"
      className="flex w-[400px] max-w-full flex-col rounded-mn-lg border border-mn-line bg-mn-surface shadow-mn-sm"
    >
      <div className="flex items-center gap-3 px-5 pt-5">
        <Skeleton shape="circle" className="size-9" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton shape="line" className="w-32" />
          <Skeleton shape="line" className="h-2.5 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-5 pt-5 pb-5">
        <Skeleton className="h-28 w-full" />
        <Skeleton shape="line" className="mt-1.5 w-full" />
        <Skeleton shape="line" className="w-4/5" />
      </div>
      <div className="flex items-center justify-between border-t border-mn-line px-5 py-3">
        <Skeleton shape="line" className="h-2.5 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </SkeletonGroup>
  );
}
