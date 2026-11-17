import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
}

const field =
  "h-10 w-full rounded-fl border border-fl-line-strong bg-fl-surface px-3.5 font-fl text-sm text-fl-fg shadow-fl outline-none " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-fl-muted " +
  "hover:border-fl-control focus-visible:border-fl-accent focus-visible:ring-3 focus-visible:ring-fl-accent/20 " +
  "disabled:cursor-not-allowed disabled:bg-fl-subtle disabled:text-fl-muted disabled:shadow-none disabled:hover:border-fl-line-strong " +
  "aria-invalid:border-fl-danger aria-invalid:focus-visible:ring-fl-danger/20";

export function Input({ label, hint, error, icon, id, className, ...props }: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={["flex flex-col gap-1.5 font-fl", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="text-[13px] font-semibold text-fl-fg">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 inline-flex size-4 -translate-y-1/2 text-fl-muted"
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
        <p id={messageId} className={`text-[13px] ${error ? "text-fl-danger" : "text-fl-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
