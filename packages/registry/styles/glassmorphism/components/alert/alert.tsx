import type { ReactNode } from "react";

export interface AlertProps {
  tone?: "neutral" | "accent" | "danger";
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// Tinted tones lay their tint on a ::before under the content (-z-10 inside the isolated pane),
// so the white glass stays underneath and muted text keeps 4.5:1 over any part of the backdrop.
const tones = {
  neutral: { root: "border-gl-edge", icon: "text-gl-muted" },
  accent: { root: "border-gl-accent/40 before:bg-gl-accent-soft/50", icon: "text-gl-accent" },
  danger: { root: "border-gl-danger/30 before:bg-gl-danger/5", icon: "text-gl-danger" },
};

const icons = {
  neutral: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.25v3.5M8 5.25v.01" />
    </>
  ),
  accent: <path d="M8 2.5 9.5 6.5l4 1.5-4 1.5L8 13.5 6.5 9.5l-4-1.5 4-1.5Z" />,
  danger: (
    <>
      <path d="M8 2.75 14 13.25H2Z" />
      <path d="M8 6.75v3M8 11.5v.01" />
    </>
  ),
};

export function Alert({ tone = "neutral", title, children, action, className }: AlertProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={[
        "relative isolate flex items-start gap-3 rounded-gl-lg border bg-gl-glass p-4 font-gl text-sm shadow-gl backdrop-blur-gl backdrop-saturate-150",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]",
        tones[tone].root,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`mt-0.5 size-4 shrink-0 ${tones[tone].icon}`}
      >
        {icons[tone]}
      </svg>
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium text-gl-fg">{title}</p>
        {children && <div className="text-gl-muted">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
