export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "away";
  className?: string;
}

const sizes = {
  sm: "size-6 text-[11px]",
  md: "size-8 text-[13px]",
  lg: "size-10 text-[15px]",
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

/** A round token with a chunky 2px edge drawn inside, so the 24/32/40 sizes hold. */
export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  const label = status ? `${name} (${status})` : name;
  return (
    <span
      className={["relative inline-flex shrink-0 font-gm", sizes[size], className]
        .filter(Boolean)
        .join(" ")}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          className="size-full rounded-full border-2 border-gm-line bg-gm-subtle object-cover"
        />
      ) : (
        <span
          role="img"
          aria-label={label}
          className="flex size-full items-center justify-center rounded-full border-2 border-gm-line bg-gm-primary-soft font-gm-display leading-none font-semibold text-gm-fg"
        >
          {initials(name)}
        </span>
      )}
      {status && (
        <span
          aria-hidden="true"
          className={`absolute right-0 bottom-0 rounded-full ring-2 ring-gm-surface ${dots[size]} ${
            status === "online" ? "bg-gm-success" : "bg-gm-control"
          }`}
        />
      )}
    </span>
  );
}
