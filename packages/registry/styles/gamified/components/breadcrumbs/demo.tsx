import { Breadcrumbs } from "./breadcrumbs";

export default function BreadcrumbsDemo() {
  return (
    <div className="flex w-fit max-w-full flex-col gap-6 font-gm">
      <Breadcrumbs
        items={[
          {
            label: "Acme",
            href: "#acme",
            icon: (
              <span className="inline-flex size-4 items-center justify-center rounded-[5px] bg-gm-primary font-gm-display text-[10px] font-semibold text-gm-on-primary">
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
