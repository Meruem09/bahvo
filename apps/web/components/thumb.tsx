"use client";

import type { Thumbs } from "@bahvo/registry";
import { useState } from "react";

/**
 * Prebuilt light and dark thumbnails; the browser picks one by color scheme.
 * Falls back to a label so grids never show a broken image while thumbnails
 * are still being generated. `priority` is for cards visible on first paint,
 * which should not wait for lazy loading.
 */
export function Thumb({
  thumbs,
  alt,
  priority = false,
}: {
  thumbs: Thumbs;
  alt: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-subtle">
      {failed ? (
        <span className="absolute inset-0 grid place-items-center text-xs text-muted">{alt}</span>
      ) : (
        <picture>
          <source srcSet={thumbs.dark} media="(prefers-color-scheme: dark)" />
          <img
            src={thumbs.light}
            alt={alt}
            width={960}
            height={600}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        </picture>
      )}
    </div>
  );
}
