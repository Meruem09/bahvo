import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
}

// Fields use the strong glass so typed text always sits on a calm, readable fill.
const field =
  "h-10 w-full rounded-gl border border-gl-edge bg-gl-glass-strong px-3.5 font-gl text-sm text-gl-fg shadow-gl outline-none backdrop-blur-gl backdrop-saturate-150 " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-gl-muted " +
  "hover:border-gl-line-strong focus-visible:border-gl-accent focus-visible:ring-3 focus-visible:ring-gl-accent/25 " +
  "disabled:cursor-not-allowed disabled:bg-gl-glass disabled:text-gl-muted disabled:shadow-none disabled:hover:border-gl-edge " +
  "aria-invalid:border-gl-danger aria-invalid:focus-visible:ring-gl-danger/25";

export function Input({ label, hint, error, icon, id, className, ...props }: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={["flex flex-col gap-1.5 font-gl", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="text-[13px] font-medium text-gl-fg">
        {label}
      </label>
      <div className="relative">
        {/* z-10: the frosted field is its own layer (backdrop-filter) and would paint over the icon. */}
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 z-10 inline-flex size-4 -translate-y-1/2 text-gl-muted"
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
        <p id={messageId} className={`text-[13px] ${error ? "text-gl-danger" : "text-gl-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
