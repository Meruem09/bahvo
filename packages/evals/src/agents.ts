/**
 * Agent adapters. Each runs one task in a sandbox and leaves its answer at
 * the suite's output path.
 *
 * - "claude": the Claude Code CLI in headless mode (`claude -p`), which loads
 *   project skills from the sandbox's .claude/skills. Set BAHVO_EVAL_AGENT to
 *   the CLI's path if it isn't on PATH.
 * - "replay:<file>": copies an existing file as the answer. Free and
 *   deterministic; used to test the scoring pipeline itself.
 */
import { spawn } from "node:child_process";
import { cp } from "node:fs/promises";
import path from "node:path";

export interface AgentResult {
  ok: boolean;
  seconds: number;
  costUsd?: number;
  turns?: number;
  error?: string;
}

const TIMEOUT_MS = 10 * 60 * 1000;

function run(command: string, args: string[], cwd: string, input: string) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(command, args, { cwd, shell: process.platform === "win32" });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill(), TIMEOUT_MS);
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ code: 1, stdout, stderr: String(error) });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
    // The prompt goes over stdin, so no shell quoting can mangle it.
    child.stdin.end(input);
  });
}

/** Runs a headless Claude Code turn and returns its parsed JSON result. */
export async function claude(
  cwd: string,
  prompt: string,
  options: { model?: string; tools?: string; maxTurns?: number } = {},
) {
  const bin = process.env.BAHVO_EVAL_AGENT ?? "claude";
  const args = [
    "-p",
    "--output-format",
    "json",
    "--permission-mode",
    "acceptEdits",
    "--max-turns",
    String(options.maxTurns ?? 40),
    ...(options.model ? ["--model", options.model] : []),
    ...(options.tools ? ["--allowedTools", options.tools] : []),
  ];
  const { code, stdout, stderr } = await run(bin, args, cwd, prompt);
  try {
    const json = JSON.parse(stdout) as {
      result?: string;
      is_error?: boolean;
      total_cost_usd?: number;
      num_turns?: number;
    };
    return { ok: code === 0 && !json.is_error, json, stderr };
  } catch {
    return { ok: false, json: undefined, stderr: stderr || stdout.slice(0, 500) };
  }
}

export async function runAgent(
  agent: string,
  sandbox: string,
  prompt: string,
  output: string,
  model?: string,
): Promise<AgentResult> {
  const started = performance.now();
  const seconds = () => Math.round((performance.now() - started) / 100) / 10;

  if (agent.startsWith("replay:")) {
    await cp(path.resolve(agent.slice("replay:".length)), path.join(sandbox, output));
    return { ok: true, seconds: seconds() };
  }
  if (agent === "claude") {
    const { ok, json, stderr } = await claude(sandbox, prompt, { model });
    return {
      ok,
      seconds: seconds(),
      costUsd: json?.total_cost_usd,
      turns: json?.num_turns,
      error: ok ? undefined : stderr.slice(0, 500),
    };
  }
  throw new Error(`Unknown agent "${agent}". Use "claude" or "replay:<file>".`);
}
