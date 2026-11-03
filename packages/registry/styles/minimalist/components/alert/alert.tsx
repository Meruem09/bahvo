import type { ReactNode } from "react";

export interface AlertProps {
  tone?: "neutral" | "accent" | "danger";
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const tones = {
  neutral: { root: "border-mn-line bg-mn-surface", icon: "text-mn-muted" },
  accent: { root: "border-mn-accent/40 bg-mn-accent-soft/50", icon: "text-mn-accent" },
  danger: { root: "border-mn-danger/30 bg-mn-danger/5", icon: "text-mn-danger" },
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
        "flex items-start gap-3 rounded-mn-lg border p-4 font-mn text-sm",
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
        <p className="font-medium text-mn-fg">{title}</p>
        {children && <div className="text-mn-muted">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
