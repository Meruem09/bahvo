import "./preview.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Runs before paint inside the iframe: follows the system theme and the saved
 * motion setting, accepts theme and motion messages from the parent, and
 * reports content height to it.
 */
const bridge = `(() => {
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  // "system" follows the OS; "light" or "dark" pins the theme until "system" comes back.
  let chosen = "system";
  const apply = () =>
    root.classList.toggle("dark", chosen === "system" ? media.matches : chosen === "dark");
  apply();
  // Ambient motion follows the site's saved toggle before first paint, then the parent's messages.
  const motion = (on) => root.setAttribute("data-motion", on ? "on" : "off");
  try {
    motion(localStorage.getItem("bahvo:motion") !== "off");
  } catch {
    motion(true);
  }
  media.addEventListener("change", apply);
  let post = () => {};
  addEventListener("message", (e) => {
    if (e.data && e.data.type === "bahvo:theme") {
      chosen = e.data.theme;
      apply();
    }
    if (e.data && e.data.type === "bahvo:motion") motion(e.data.on !== false);
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
