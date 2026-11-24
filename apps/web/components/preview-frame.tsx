"use client";

import { cn } from "@bahvo/ui/cn";
import { useEffect, useRef, useState } from "react";
import { capitalize } from "@/lib/text";
import { DownloadIcon, ExternalIcon } from "./icons";
import { Segmented } from "./segmented";

const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

/** Saved motion preference, shared with the preview iframe (same origin). */
const MOTION_KEY = "bahvo:motion";

function readMotion() {
  try {
    return localStorage.getItem(MOTION_KEY) !== "off";
  } catch {
    return true;
  }
}

function send(frame: HTMLIFrameElement | null, message: object) {
  frame?.contentWindow?.postMessage(message, "*");
}

/**
 * Isolated, lazily loaded live preview. The iframe page carries only the
 * style's CSS, font and one item; it reports its height so the frame never
 * scrolls, switches theme on request so both can be checked, and turns the
 * illustration's ambient motion on or off (remembered across pages).
 */
export function PreviewFrame({
  src,
  title,
  download,
}: {
  src: string;
  title: string;
  /** Standalone SVGs: one download per theme, whatever the preview shows. */
  download?: { light: string; dark: string; name: string };
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(360);
  const [theme, setTheme] = useState<Theme>("system");
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== ref.current?.contentWindow) return;
      if (event.data?.type === "bahvo:height" && typeof event.data.height === "number") {
        setHeight(Math.max(240, Math.ceil(event.data.height)));
      }
    }
    window.addEventListener("message", onMessage);
    // The iframe can finish loading before this component hydrates and miss
    // our listener, so ask for the height once we're listening.
    send(ref.current, { type: "bahvo:hello" });
    setMotion(readMotion());
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    send(ref.current, { type: "bahvo:theme", theme: next });
  }

  function toggleMotion() {
    const next = !motion;
    setMotion(next);
    try {
      localStorage.setItem(MOTION_KEY, next ? "on" : "off");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this page.
    }
    send(ref.current, { type: "bahvo:motion", on: next });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-subtle">
      {/* Every control is 34px tall in a 44px bar, so the inset is 5px on all sides. */}
      <div className="flex h-11 items-center gap-2 border-b border-line bg-card px-[5px]">
        <Segmented
          legend="Preview theme"
          options={themes}
          value={theme}
          onChange={choose}
          label={capitalize}
        />
        {download && (
          <>
            <div className="ml-auto flex items-center">
              <span className="flex h-[34px] divide-x divide-line overflow-hidden rounded-[7px] border border-line bg-card">
                {(["light", "dark"] as const).map((variant) => (
                  <a
                    key={variant}
                    href={download[variant]}
                    download={`${download.name}-${variant}.svg`}
                    aria-label={`Download ${variant} SVG`}
                    className="flex items-center gap-1.5 px-2.5 text-[13px] text-fg transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                  >
                    <DownloadIcon className="size-3.5 text-muted" />
                    {variant === "light" ? "Light SVG" : "Dark SVG"}
                  </a>
                ))}
              </span>
            </div>
            <span aria-hidden="true" className="h-5 w-px bg-line" />
          </>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={motion}
          onClick={toggleMotion}
          className={cn(
            "flex h-[34px] items-center gap-2 rounded-[7px] border border-line bg-card px-2.5 text-[13px] text-muted transition-colors hover:bg-subtle hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
            !download && "ml-auto",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative h-3.5 w-6 rounded-full border transition-colors",
              motion ? "border-fg bg-fg" : "border-line bg-subtle",
            )}
          >
            <span
              className={cn(
                "absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-card transition-[left]",
                motion ? "left-[11px]" : "left-[1px]",
              )}
            />
          </span>
          Motion
          {/* The state in words too, so the switch reads the same in every system. */}
          <span aria-hidden="true" className="w-[22px] text-left text-muted">
            {motion ? "On" : "Off"}
          </span>
        </button>
        {/* The bare preview page, to try the item at any window size. */}
        <a
          href={src}
          target="_blank"
          rel="noopener"
          aria-label="Open the preview in a new tab"
          title="Open in a new tab"
          className="hidden size-[34px] shrink-0 items-center justify-center rounded-[7px] border border-line bg-card text-muted transition-colors hover:bg-subtle hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:flex"
        >
          <ExternalIcon className="size-4" />
        </a>
      </div>
      {/* The border lives on the wrapper so the iframe's content box is exactly `height`. */}
      <iframe
        ref={ref}
        src={src}
        title={title}
        loading="lazy"
        onLoad={(event) => {
          send(event.currentTarget, { type: "bahvo:hello" });
          send(event.currentTarget, { type: "bahvo:theme", theme });
          send(event.currentTarget, { type: "bahvo:motion", on: motion });
        }}
        style={{ height }}
        className="block w-full"
      />
    </div>
  );
}
