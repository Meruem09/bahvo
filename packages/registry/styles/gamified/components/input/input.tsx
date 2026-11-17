import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
}

// Fields are sunk slots: a 2px edge and an inner top shade instead of a ledge.
const field =
  "h-10 w-full rounded-gm border-2 border-gm-line bg-gm-surface px-3.5 font-gm text-sm font-semibold text-gm-fg shadow-gm-inset outline-none " +
  "transition-[border-color,box-shadow] duration-150 placeholder:font-normal placeholder:text-gm-muted " +
  "hover:border-gm-control focus-visible:border-gm-primary focus-visible:ring-4 focus-visible:ring-gm-primary/20 " +
  "disabled:cursor-not-allowed disabled:bg-gm-subtle disabled:text-gm-muted disabled:hover:border-gm-line " +
  "aria-invalid:border-gm-danger aria-invalid:focus-visible:ring-gm-danger/20";

export function Input({ label, hint, error, icon, id, className, ...props }: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={["flex flex-col gap-1.5 font-gm", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="text-[13px] font-bold text-gm-fg">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 inline-flex size-4 -translate-y-1/2 text-gm-muted"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={[field, icon && "pl-10"].filter(Boolean).join(" ")}
          {...props}
        />
      </div>
      {message && (
        <p
          id={messageId}
          className={`flex items-center gap-1.5 text-[13px] ${error ? "font-semibold text-gm-danger" : "text-gm-muted"}`}
        >
          {error && (
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
              <circle cx="8" cy="8" r="7" fill="currentColor" />
              <path
                d="M8 4.5v4"
                className="stroke-gm-surface"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="8" cy="11.25" r="1.1" className="fill-gm-surface" />
            </svg>
          )}
          {message}
        </p>
      )}
    </div>
  );
}
