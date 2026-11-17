import type { ReactNode } from "react";

export interface AlertProps {
  tone?: "neutral" | "accent" | "danger";
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// A chunky pane whose 2px edge and hard ledge take the tone's color.
const tones = {
  neutral: {
    root: "border-gm-line bg-gm-surface shadow-gm",
    icon: "text-gm-muted",
    svg: "size-5",
  },
  accent: {
    root: "border-gm-primary bg-gm-primary-soft shadow-[0_4px_0_var(--gm-primary-depth)]",
    icon: "rounded-full bg-gm-primary text-gm-on-primary",
    svg: "size-3.5",
  },
  danger: {
    root: "border-gm-danger bg-gm-danger-soft shadow-[0_4px_0_var(--gm-danger-depth)]",
    icon: "text-gm-danger",
    svg: "size-5",
  },
};

const icons = {
  neutral: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.25v3.5M8 5.25v.01" />
    </>
  ),
  accent: <path d="M8 2.5 9.5 6.5l4 1.5-4 1.5L8 13.5 6.5 9.5l-4-1.5 4-1.5Z" fill="currentColor" />,
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
        "flex items-start gap-3 rounded-gm-lg border-2 p-4 font-gm text-sm",
        tones[tone].root,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={`inline-flex size-6 shrink-0 items-center justify-center ${tones[tone].icon}`}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={tones[tone].svg}
        >
          {icons[tone]}
        </svg>
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-gm-display text-[15px] leading-6 font-semibold text-gm-fg">{title}</p>
        {children && <div className="text-gm-muted">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
