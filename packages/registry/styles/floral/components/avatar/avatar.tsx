export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "away";
  className?: string;
}

const sizes = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
};

const dots = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** A round photo, or Fraunces initials on a sage leaf, with an orchid dot while someone is online. */
export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  const label = status ? `${name} (${status})` : name;
  return (
    <span
      className={["relative inline-flex shrink-0 font-fl", sizes[size], className]
        .filter(Boolean)
        .join(" ")}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          className="size-full rounded-full object-cover ring-1 ring-fl-line"
        />
      ) : (
        <span
          role="img"
          aria-label={label}
          className="flex size-full items-center justify-center rounded-full bg-fl-leaf font-fl-display font-semibold text-fl-fg ring-1 ring-fl-line"
        >
          {initials(name)}
        </span>
      )}
      {status && (
        <span
          aria-hidden="true"
          className={`absolute right-0 bottom-0 rounded-full ring-2 ring-fl-surface ${dots[size]} ${
            status === "online" ? "bg-fl-accent" : "bg-fl-line-strong"
          }`}
        />
      )}
    </span>
  );
}
