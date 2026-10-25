import type { Metadata } from "next";
import Link from "next/link";
import { manifest } from "@/lib/registry";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
        <p className="text-muted">
          Every component has one API in every style. Switching styles means changing one import.
        </p>
      </header>
      <ul className="divide-y divide-line rounded-xl border border-line bg-card">
        {manifest.components.map((component) => (
          <li key={component.slug}>
            <Link
              href={`/components/${component.slug}`}
              className="flex items-center gap-4 p-4 hover:bg-subtle"
            >
              <span className="font-medium">{component.name}</span>
              <span className="text-sm text-muted">{component.description}</span>
              <span className="ml-auto shrink-0 text-xs text-muted">
                {component.styles.length} style{component.styles.length === 1 ? "" : "s"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
