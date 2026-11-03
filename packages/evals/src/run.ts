/**
 * Skill eval runner.
 *
 *   pnpm --filter @bahvo/evals eval --style isometric [--tasks cloud,chip]
 *     [--conditions skill,baseline] [--agent claude | replay:<file>] [--model <id>] [--judge]
 *
 * For every task and condition it creates a clean sandbox, lets the agent
 * answer, scores the answer, then (with --judge) compares both answers
 * against the published examples. Results land in results/<style>/<run>/;
 * real-agent runs also update results/<style>/latest.json, the published
 * skill score.
 */
import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "playwright";
import { runAgent } from "./agents";
import { judge } from "./judge";
import { summarize, type TaskResult, writeReport } from "./report";
import {
  type Condition,
  createSandbox,
  evalsRoot,
  loadStyle,
  loadSuite,
  repoRoot,
} from "./sandbox";
import { score } from "./score";

const { values } = parseArgs({
  options: {
    style: { type: "string" },
    tasks: { type: "string" },
    conditions: { type: "string", default: "skill,baseline" },
    agent: { type: "string", default: "claude" },
    model: { type: "string" },
    judge: { type: "boolean", default: false },
  },
});

if (!values.style) {
  console.error(
    "Usage: eval --style <style> [--tasks a,b] [--agent claude|replay:<file>] [--judge]",
  );
  process.exit(2);
}

const suite = await loadSuite(values.style);
const info = await loadStyle(values.style);
const wanted = values.tasks?.split(",");
const tasks = suite.tasks.filter((t) => !wanted || wanted.includes(t.id));
const conditions = values.conditions.split(",") as Condition[];
const agent = values.agent;
const replay = agent.startsWith("replay:");

const runDir = path.join(
  evalsRoot,
  "results",
  suite.style,
  new Date().toISOString().replace(/[:.]/g, "-"),
);
await mkdir(runDir, { recursive: true });

const browser = await chromium.launch();
const results: TaskResult[] = [];
try {
  for (const task of tasks) {
    const result: TaskResult = { id: task.id, subject: task.subject, runs: {} };
    const prompt = suite.prompt
      .replace("{subject}", task.subject)
      .replace("{output}", suite.output);
    for (const condition of conditions) {
      const sandbox = await createSandbox(suite, condition, task.id);
      process.stdout.write(`${task.id} · ${condition} · ${agent} … `);
      const agentResult = await runAgent(agent, sandbox, prompt, suite.output, values.model);
      const answer = path.join(runDir, `${task.id}-${condition}.tsx`);
      await cp(path.join(sandbox, suite.output), answer).catch(() => {});
      const s = await score(browser, {
        style: suite.style,
        info,
        sandbox,
        output: suite.output,
        shotBase: path.join(runDir, `${task.id}-${condition}`),
      });
      result.runs[condition] = { agent: agentResult, score: s, answer };
      console.log(`${s.structural}${s.rendered ? "" : ` (${s.renderError})`}`);
    }

    const skillShot = result.runs.skill?.score.shots?.light;
    const baseShot = result.runs.baseline?.score.shots?.light;
    if (values.judge && skillShot && baseShot) {
      const thumbs = path.join(repoRoot, "apps/web/public/thumbs", suite.style);
      const references = (await readdir(thumbs).catch(() => []))
        .filter((f) => f.endsWith(".light.webp"))
        .slice(0, 3)
        .map((f) => path.join(thumbs, f));
      result.verdict = await judge({
        cwd: runDir,
        style: suite.style,
        subject: task.subject,
        answers: { skill: skillShot, baseline: baseShot },
        references,
        model: values.model,
      });
    }
    results.push(result);
  }
} finally {
  await browser.close();
}

const summary = summarize(suite.style, agent, values.model, results);
await writeReport(runDir, summary, results);
if (!replay && tasks.length === suite.tasks.length) {
  await writeFile(
    path.join(evalsRoot, "results", suite.style, "latest.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
}
console.log(`\n${JSON.stringify(summary.structural)} → ${path.join(runDir, "report.html")}`);
