import { Tabs } from "./tabs";

function Row({ name, meta }: { name: string; meta: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-2.5">
      <span className="font-medium">{name}</span>
      <span className="text-[13px] text-mn-muted">{meta}</span>
    </li>
  );
}

export default function TabsDemo() {
  return (
    <div className="w-[480px] max-w-full">
      <Tabs
        label="Project"
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <ul className="divide-y divide-mn-line">
                <Row name="Production" meta="acme.dev · 2m ago" />
                <Row name="Preview" meta="feat-billing · 18m ago" />
                <Row name="Development" meta="localhost:3000" />
              </ul>
            ),
          },
          {
            id: "deployments",
            label: "Deployments",
            content: <p className="text-mn-muted">214 deployments in the last 30 days.</p>,
          },
          {
            id: "settings",
            label: "Settings",
            content: <p className="text-mn-muted">Domains, environment variables and members.</p>,
          },
          { id: "logs", label: "Logs", content: null, disabled: true },
        ]}
      />
    </div>
  );
}
