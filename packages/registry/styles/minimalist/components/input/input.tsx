import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
}

const field =
  "h-9 w-full rounded-mn border border-mn-line bg-mn-surface px-3 font-mn text-sm text-mn-fg shadow-mn-sm outline-none " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-mn-muted " +
  "hover:border-mn-line-strong focus-visible:border-mn-accent focus-visible:ring-3 focus-visible:ring-mn-accent/20 " +
  "disabled:cursor-not-allowed disabled:bg-mn-subtle disabled:text-mn-muted disabled:shadow-none disabled:hover:border-mn-line " +
  "aria-invalid:border-mn-danger aria-invalid:focus-visible:ring-mn-danger/20";

export function Input({ label, hint, error, icon, id, className, ...props }: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={["flex flex-col gap-1.5 font-mn", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="text-[13px] font-medium text-mn-fg">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 inline-flex size-4 -translate-y-1/2 text-mn-muted"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={[field, icon && "pl-9"].filter(Boolean).join(" ")}
          {...props}
        />
      </div>
      {message && (
        <p id={messageId} className={`text-[13px] ${error ? "text-mn-danger" : "text-mn-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
