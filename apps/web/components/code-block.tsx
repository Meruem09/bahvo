import type { CodeFile } from "@bahvo/registry";

/** Renders Shiki HTML produced by the registry build. No client JS. */
export function CodeBlock({ file }: { file: CodeFile }) {
  return (
    <div>
      <div className="mb-2 font-mono text-xs text-muted">{file.name}</div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, build-time Shiki output. */}
      <div dangerouslySetInnerHTML={{ __html: file.html }} />
    </div>
  );
}
