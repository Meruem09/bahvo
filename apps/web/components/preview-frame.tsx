"use client";

import { cn } from "@bahvo/ui/cn";
import { useEffect, useRef, useState } from "react";

type Theme = "system" | "light" | "dark";

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
        <fieldset className="flex rounded-[7px] border border-line bg-subtle p-0.5">
          <legend className="sr-only">Preview theme</legend>
          {(["system", "light", "dark"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={theme === option}
              onClick={() => choose(option)}
              className="h-7 rounded-[4px] border border-transparent px-2.5 text-[13px] text-muted capitalize transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent aria-pressed:border-line aria-pressed:bg-card aria-pressed:text-fg aria-pressed:shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
            >
              {option}
            </button>
          ))}
        </fieldset>
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
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-3.5 text-muted"
                    >
                      <path d="M8 2.75v7.5M4.75 7 8 10.25 11.25 7M3 13.25h10" />
                    </svg>
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
