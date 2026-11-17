import { Badge } from "./badge";

const services = [
  {
    name: "api-gateway",
    region: "fra",
    badge: (
      <Badge variant="live" dot>
        Live
      </Badge>
    ),
  },
  { name: "web", region: "iad", badge: <Badge dot>Building</Badge> },
  {
    name: "worker",
    region: "sin",
    badge: <Badge variant="danger">Failed</Badge>,
  },
  { name: "docs", region: "fra", badge: <Badge variant="outline">Paused</Badge> },
];

export default function BadgeDemo() {
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-6 font-gm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Neutral</Badge>
        <Badge variant="live" dot>
          Live
        </Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="danger">Error</Badge>
      </div>
      <ul className="divide-y-2 divide-gm-line rounded-gm-lg border-2 border-gm-line bg-gm-surface text-sm shadow-gm">
        {services.map((service) => (
          <li key={service.name} className="flex items-center gap-3 px-4 py-3">
            <span className="font-semibold text-gm-fg">{service.name}</span>
            <span className="text-[13px] text-gm-muted">{service.region}</span>
            <span className="ml-auto">{service.badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
