"use client";

import { useState } from "react";

/**
 * Prebuilt thumbnail with a graceful fallback, so grids never show a broken
 * image while thumbnails are still being generated.
 */
export function Thumb({ src, alt, accent }: { src: string; alt: string; accent: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="relative aspect-[16/10] overflow-hidden bg-subtle"
      style={{ backgroundImage: `linear-gradient(135deg, ${accent}33, transparent 70%)` }}
    >
      {failed ? (
        <span className="absolute inset-0 grid place-items-center text-xs text-muted">{alt}</span>
      ) : (
        // biome-ignore lint/performance/noImgElement: thumbnails are prebuilt, sized WebP files.
        <img
          src={src}
          alt={alt}
          width={960}
          height={600}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}
