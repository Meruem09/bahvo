/**
 * Vision judge: an agent looks at both answers for a task (with and without
 * the skill, in a random order it doesn't know) next to the style's published
 * examples, and scores each for style fidelity and craft. Pairwise and blind,
 * because absolute scores from a model drift; preferences are more stable.
 */
import { claude } from "./agents";

export interface Verdict {
  /** 1–5 per answer, keyed by condition. */
  fidelity: { skill: number; baseline: number };
  craft: { skill: number; baseline: number };
  preferred: "skill" | "baseline" | "tie";
  reason: string;
}

export async function judge(options: {
  cwd: string;
  style: string;
  subject: string;
  answers: { skill: string; baseline: string };
  references: string[];
  model?: string;
}): Promise<Verdict | { error: string }> {
  const flip = Math.random() < 0.5;
  const [a, b] = flip
    ? [options.answers.baseline, options.answers.skill]
    : [options.answers.skill, options.answers.baseline];
  const prompt = [
    `You are judging two candidate designs in the "${options.style}" style. The subject was: ${options.subject}.`,
    "",
    "Read these reference images first; they define the style:",
    ...options.references.map((r) => `- ${r}`),
    "",
    `Candidate A: ${a}`,
    `Candidate B: ${b}`,
    "",
    "Score each candidate 1-5 for fidelity (how exactly it matches the references' look: palette, line weight, spacing, restraint) and craft (alignment, consistency, no clipped, overlapping or stray elements). Then pick the better one.",
    'Reply with only this JSON: {"fidelity":{"A":n,"B":n},"craft":{"A":n,"B":n},"preferred":"A"|"B"|"tie","reason":"one sentence"}',
  ].join("\n");

  const { ok, json, stderr } = await claude(options.cwd, prompt, {
    model: options.model,
    tools: "Read",
    maxTurns: 12,
  });
  if (!ok || !json?.result) return { error: stderr || "The judge returned nothing." };
  const match = /\{[\s\S]*\}/.exec(json.result);
  if (!match) return { error: `Unparseable verdict: ${json.result.slice(0, 200)}` };
  try {
    const raw = JSON.parse(match[0]) as {
      fidelity: { A: number; B: number };
      craft: { A: number; B: number };
      preferred: "A" | "B" | "tie";
      reason: string;
    };
    const skillKey = flip ? "B" : "A";
    const baseKey = flip ? "A" : "B";
    return {
      fidelity: { skill: raw.fidelity[skillKey], baseline: raw.fidelity[baseKey] },
      craft: { skill: raw.craft[skillKey], baseline: raw.craft[baseKey] },
      preferred:
        raw.preferred === "tie" ? "tie" : raw.preferred === skillKey ? "skill" : "baseline",
      reason: raw.reason,
    };
  } catch {
    return { error: `Unparseable verdict: ${match[0].slice(0, 200)}` };
  }
}
