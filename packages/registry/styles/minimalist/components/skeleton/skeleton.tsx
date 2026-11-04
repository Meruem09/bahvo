import type { HTMLAttributes, ReactNode } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Text line, rectangle or circle. Size it with className. */
  shape?: "line" | "block" | "circle";
}

const shapes = {
  line: "h-3 rounded-full",
  block: "rounded-mn",
  circle: "rounded-full",
};

/** A placeholder shape. Hidden from assistive tech; wrap them in a SkeletonGroup. */
export function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={["bg-mn-line motion-safe:animate-pulse", shapes[shape], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** What is loading, announced once for the whole group. */
  label: string;
  children: ReactNode;
}

export function SkeletonGroup({ label, className, children, ...props }: SkeletonGroupProps) {
  return (
    <div role="status" aria-busy="true" className={className} {...props}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
