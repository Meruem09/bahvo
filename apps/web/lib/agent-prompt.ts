import type { ItemDetail, ManifestStyle } from "@bahvo/registry";

/** Markdown table cells can't hold raw pipes or line breaks. */
const cell = (text: string) => text.replaceAll("|", "\\|").replace(/\s*\n\s*/g, " ");

/**
 * What "Copy prompt" puts on the clipboard: a Markdown brief a coding agent
 * can act on without opening the site. It installs through the CLI rather
 * than pasting source, so the agent gets the tokens and any kit files too.
 */
export function agentPrompt(item: ItemDetail, style: ManifestStyle | undefined): string {
  const noun = item.kind === "illustrations" ? "illustration" : "component";
  const lines = [
    `Add the ${item.styleName} ${item.name} ${noun} from bahvo to this project.`,
    "",
    item.description,
    "",
    "## Install",
    "",
    "```sh",
    item.install.bahvo,
    "```",
    "",
    `Or with the shadcn CLI: \`${item.install.shadcn}\``,
  ];

  if (item.contract) {
    lines.push(
      "",
      "## Props",
      "",
      "| Prop | Type | Default | Description |",
      "| --- | --- | --- | --- |",
    );
    for (const prop of item.contract.props) {
      lines.push(
        `| \`${cell(prop.name)}\` | \`${cell(prop.type)}\` | ${prop.default ? `\`${cell(prop.default)}\`` : "–"} | ${cell(prop.description)} |`,
      );
    }
    if (item.states.length > 0) lines.push("", "## States", "", item.states.join(", "));
    lines.push("", "## Accessibility", "", ...item.contract.a11y.map((rule) => `- ${rule}`));
  }

  if (item.subject) {
    lines.push("", "## Good for", "", ...item.subject.uses.map((use) => `- ${use}`));
  }

  if (style?.skill) {
    lines.push(
      "",
      `## More in the ${style.name} style`,
      "",
      `To make new ${noun}s that match, install the style's agent skill first: \`${style.skill.install}\``,
    );
  }

  return `${lines.join("\n")}\n`;
}
