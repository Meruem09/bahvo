/** Writes a run's report.json and a self-contained report.html. */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { AgentResult } from "./agents";
import type { Verdict } from "./judge";
import type { Condition } from "./sandbox";
import type { Score } from "./score";

export interface TaskResult {
  id: string;
  subject: string;
  runs: Partial<Record<Condition, { agent: AgentResult; score: Score; answer: string }>>;
  verdict?: Verdict | { error: string };
}

export interface Summary {
  style: string;
  date: string;
  agent: string;
  model?: string;
  tasks: number;
  /** Mean structural score (0–100) per condition. */
  structural: Partial<Record<Condition, number>>;
  /** Mean judge fidelity (1–5) per condition, when judged. */
  fidelity?: { skill: number; baseline: number };
  /** Share of judged tasks where the skill's answer was preferred. */
  winRate?: number;
}

const mean = (values: number[]) =>
  values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0;

export function summarize(
  style: string,
  agent: string,
  model: string | undefined,
  results: TaskResult[],
): Summary {
  const structural: Summary["structural"] = {};
  for (const condition of ["skill", "baseline"] as const) {
    const scores = results.flatMap((r) => {
      const run = r.runs[condition];
      return run ? [run.score.structural] : [];
    });
    if (scores.length) structural[condition] = mean(scores);
  }
  const verdicts = results.flatMap((r) =>
    r.verdict && "preferred" in r.verdict ? [r.verdict] : [],
  );
  return {
    style,
    date: new Date().toISOString(),
    agent,
    model,
    tasks: results.length,
    structural,
    ...(verdicts.length
      ? {
          fidelity: {
            skill: mean(verdicts.map((v) => v.fidelity.skill)),
            baseline: mean(verdicts.map((v) => v.fidelity.baseline)),
          },
          winRate: Math.round(
            (verdicts.filter((v) => v.preferred === "skill").length / verdicts.length) * 100,
          ),
        }
      : {}),
  };
}

const esc = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function writeReport(dir: string, summary: Summary, results: TaskResult[]) {
  await writeFile(path.join(dir, "report.json"), JSON.stringify({ summary, results }, null, 2));
  const rel = (p?: string) => (p ? path.relative(dir, p).replaceAll("\\", "/") : "");
  const cell = (condition: Condition, r: TaskResult) => {
    const run = r.runs[condition];
    if (!run) return "<td>–</td>";
    const s = run.score;
    return `<td>
      <div class="meta"><b>${s.structural}</b> · ${s.rendered ? "renders" : `<span class="bad">no render</span>`} · ${s.errors} err · ${s.warnings} warn${run.agent.seconds ? ` · ${run.agent.seconds}s` : ""}${run.agent.costUsd ? ` · $${run.agent.costUsd.toFixed(3)}` : ""}</div>
      ${s.shots ? `<div class="shots"><img src="${rel(s.shots.light)}" alt=""><img src="${rel(s.shots.dark)}" alt=""></div>` : `<p class="bad">${esc(s.renderError ?? run.agent.error ?? "")}</p>`}
      ${s.issues.length ? `<ul>${s.issues.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
    </td>`;
  };
  const verdict = (r: TaskResult) => {
    if (!r.verdict) return "";
    if ("error" in r.verdict) return `<p class="bad">Judge: ${esc(r.verdict.error)}</p>`;
    const v = r.verdict;
    return `<p>Judge prefers <b>${v.preferred}</b>. Fidelity ${v.fidelity.skill} vs ${v.fidelity.baseline}, craft ${v.craft.skill} vs ${v.craft.baseline}. ${esc(v.reason)}</p>`;
  };
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${summary.style} skill eval</title>
<style>body{font:14px system-ui;margin:32px;color:#1c1917;background:#fcfbfa}table{border-collapse:collapse;width:100%}td,th{border:1px solid #e9e6e2;padding:12px;vertical-align:top;text-align:left}.shots{display:flex;gap:8px}.shots img{width:50%;border:1px solid #e9e6e2;border-radius:6px}.meta{margin-bottom:8px}.bad{color:#c0362c}ul{margin:8px 0 0;padding-left:18px;color:#78716c;font-size:12px}</style></head><body>
<h1>${esc(summary.style)} skill eval</h1>
<p>${esc(summary.date)} · agent ${esc(summary.agent)}${summary.model ? ` (${esc(summary.model)})` : ""} · ${summary.tasks} tasks</p>
<p>Structural: with skill <b>${summary.structural.skill ?? "–"}</b>, without <b>${summary.structural.baseline ?? "–"}</b>${summary.fidelity ? ` · Judge fidelity ${summary.fidelity.skill} vs ${summary.fidelity.baseline} · skill preferred in ${summary.winRate}%` : ""}</p>
<table><tr><th>Task</th><th>With skill</th><th>Without skill</th></tr>
${results.map((r) => `<tr><td><b>${esc(r.id)}</b><br>${esc(r.subject)}${verdict(r)}</td>${cell("skill", r)}${cell("baseline", r)}</tr>`).join("\n")}
</table></body></html>`;
  await writeFile(path.join(dir, "report.html"), html);
}
