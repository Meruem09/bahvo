import { Skeleton, SkeletonGroup } from "./skeleton";

export default function SkeletonDemo() {
  return (
    <SkeletonGroup
      label="Loading project"
      className="flex w-[400px] max-w-full flex-col rounded-gl-lg border border-gl-edge bg-gl-glass shadow-gl backdrop-blur-gl backdrop-saturate-150"
    >
      <div className="flex items-center gap-3 px-6 pt-6">
        <Skeleton shape="circle" className="size-9" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton shape="line" className="w-32" />
          <Skeleton shape="line" className="h-2.5 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-6 pt-5 pb-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton shape="line" className="mt-1.5 w-full" />
        <Skeleton shape="line" className="w-4/5" />
      </div>
      <div className="flex items-center justify-between border-t border-gl-line px-6 py-3">
        <Skeleton shape="line" className="h-2.5 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </SkeletonGroup>
  );
}
