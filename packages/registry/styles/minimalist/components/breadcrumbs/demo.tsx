import { Breadcrumbs } from "./breadcrumbs";

export default function BreadcrumbsDemo() {
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-6 font-mn">
      <Breadcrumbs
        items={[
          {
            label: "Acme",
            href: "#acme",
            icon: (
              <span className="inline-flex size-4 items-center justify-center rounded-[4px] bg-mn-fg text-[10px] font-semibold text-mn-inverse">
                A
              </span>
            ),
          },
          { label: "Projects", href: "#projects" },
          { label: "acme-web", href: "#acme-web" },
          { label: "Settings" },
        ]}
      />
      <Breadcrumbs
        label="Docs breadcrumb"
        items={[
          { label: "Docs", href: "#docs" },
          { label: "Components", href: "#components" },
          { label: "Breadcrumbs" },
        ]}
      />
    </div>
  );
}
