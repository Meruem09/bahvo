"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Isolated, lazily loaded live preview. The iframe page carries only the
 * style's CSS, font and one component; it reports its height so the frame
 * never scrolls.
 */
function sayHello(frame: HTMLIFrameElement | null) {
  frame?.contentWindow?.postMessage({ type: "bahvo:hello" }, "*");
}

export function PreviewFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(360);

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
    sayHello(ref.current);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // The border lives on the wrapper so the iframe's content box is exactly `height`.
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-subtle">
      <iframe
        ref={ref}
        src={src}
        title={title}
        loading="lazy"
        onLoad={(event) => sayHello(event.currentTarget)}
        style={{ height }}
        className="block w-full"
      />
    </div>
  );
}
