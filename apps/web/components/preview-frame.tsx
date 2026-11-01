"use client";

import { cn } from "@bahvo/ui/cn";
import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

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
export function PreviewFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(360);
  const [theme, setTheme] = useState<Theme | null>(null);
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
      <div className="flex items-center gap-1 border-b border-line bg-card px-2 py-1.5">
        <button
          type="button"
          role="switch"
          aria-checked={motion}
          onClick={toggleMotion}
          className="mr-auto flex items-center gap-2 rounded-md px-2.5 py-1 text-xs text-muted transition-colors hover:text-fg"
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative h-3.5 w-6 rounded-full border transition-colors",
              motion ? "border-accent bg-accent" : "border-line bg-subtle",
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
        </button>
        {(["light", "dark"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={theme === option}
            onClick={() => choose(option)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs capitalize transition-colors",
              theme === option ? "bg-subtle text-fg" : "text-muted hover:text-fg",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {/* The border lives on the wrapper so the iframe's content box is exactly `height`. */}
      <iframe
        ref={ref}
        src={src}
        title={title}
        loading="lazy"
        onLoad={(event) => {
          send(event.currentTarget, { type: "bahvo:hello" });
          if (theme) send(event.currentTarget, { type: "bahvo:theme", theme });
          send(event.currentTarget, { type: "bahvo:motion", on: motion });
        }}
        style={{ height }}
        className="block w-full"
      />
    </div>
  );
}
