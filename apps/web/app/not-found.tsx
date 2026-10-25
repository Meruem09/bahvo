import Link from "next/link";

/**
 * Global 404 for unmatched URLs. It sits on the bare root layout, so it must
 * not import site CSS: anything imported here loads on every route, previews
 * included. Styled site 404s live in (site)/not-found.tsx.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Not found</h1>
        <p style={{ opacity: 0.7 }}>This page doesn't exist.</p>
        <Link href="/">Back to bahvo</Link>
      </div>
    </main>
  );
}
