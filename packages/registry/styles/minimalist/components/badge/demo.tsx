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
    badge: (
      <Badge variant="danger" dot>
        Failed
      </Badge>
    ),
  },
  { name: "docs", region: "fra", badge: <Badge variant="outline">Paused</Badge> },
];

export default function BadgeDemo() {
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-6 font-mn">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Neutral</Badge>
        <Badge variant="live" dot>
          Live
        </Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="danger" dot>
          Error
        </Badge>
      </div>
      <ul className="divide-y divide-mn-line rounded-mn-lg border border-mn-line bg-mn-surface text-sm">
        {services.map((service) => (
          <li key={service.name} className="flex items-center gap-3 px-4 py-3">
            <span className="font-medium text-mn-fg">{service.name}</span>
            <span className="text-[13px] text-mn-muted">{service.region}</span>
            <span className="ml-auto">{service.badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
