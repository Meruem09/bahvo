import type { ReactNode } from "react";

export interface AlertProps {
  tone?: "neutral" | "accent" | "danger";
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// Every tone is opaque paper; the danger tint is laid over the paper so it never shows the backdrop through.
const tones = {
  neutral: { root: "border-fl-line bg-fl-surface", icon: "text-fl-muted" },
  accent: { root: "border-fl-accent/30 bg-fl-accent-soft", icon: "text-fl-accent" },
  danger: {
    root: "relative isolate border-fl-danger/40 bg-fl-surface before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-fl-danger/5",
    icon: "text-fl-danger",
  },
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

/** A leaf-cut paper pane with an icon, a Fraunces title and an optional action. */
export function Alert({ tone = "neutral", title, children, action, className }: AlertProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={[
        "flex items-start gap-3 rounded-fl-leaf border px-5 py-4 font-fl text-sm shadow-fl",
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
        <p className="font-fl-display text-[15px] leading-snug font-semibold text-fl-fg">{title}</p>
        {children && <div className="text-fl-muted">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
