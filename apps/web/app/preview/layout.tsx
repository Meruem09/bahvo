import "./preview.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Runs before paint inside the iframe: follows the system theme, accepts
 * theme messages from the parent, and reports content height to it.
 */
const bridge = `(() => {
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const set = (theme) => root.classList.toggle("dark", theme === "dark");
  set(media.matches ? "dark" : "light");
  media.addEventListener("change", (e) => set(e.matches ? "dark" : "light"));
  let post = () => {};
  addEventListener("message", (e) => {
    if (e.data && e.data.type === "bahvo:theme") set(e.data.theme);
    // The parent may hydrate after this page loaded; it says hello to get the height.
    if (e.data && e.data.type === "bahvo:hello") post();
  });
  // Measure the content, not the document: the stage fills the viewport, so
  // the document height would just echo the iframe's own height back.
  const watch = () => {
    const content = document.querySelector("[data-bahvo-content]");
    if (!content) return false;
    const stage = getComputedStyle(content.parentElement);
    post = () => {
      const height =
        content.getBoundingClientRect().height +
        parseFloat(stage.paddingTop) +
        parseFloat(stage.paddingBottom);
      parent.postMessage({ type: "bahvo:height", height }, "*");
    };
    new ResizeObserver(post).observe(content);
    return true;
  };
  addEventListener("DOMContentLoaded", () => {
    if (watch()) return;
    const observer = new MutationObserver(() => watch() && observer.disconnect());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();`;

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, inline bootstrap script. */}
      <script dangerouslySetInnerHTML={{ __html: bridge }} />
      {children}
    </>
  );
}
