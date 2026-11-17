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

export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  const label = status ? `${name} (${status})` : name;
  return (
    <span
      className={["relative inline-flex shrink-0 font-gl", sizes[size], className]
        .filter(Boolean)
        .join(" ")}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          className="size-full rounded-full object-cover ring-1 ring-gl-edge"
        />
      ) : (
        // A tinted well rather than white glass, so initials still read on a light pane and stacked avatars stay apart.
        <span
          role="img"
          aria-label={label}
          className="flex size-full items-center justify-center rounded-full bg-gl-line font-medium text-gl-fg ring-1 ring-gl-edge"
        >
          {initials(name)}
        </span>
      )}
      {status && (
        <span
          aria-hidden="true"
          className={`absolute right-0 bottom-0 rounded-full ring-2 ring-gl-glass-strong ${dots[size]} ${
            status === "online" ? "bg-gl-accent" : "bg-gl-line-strong"
          }`}
        />
      )}
    </span>
  );
}
