import { Accordion } from "./accordion";

export default function AccordionDemo() {
  return (
    <Accordion
      className="w-[520px] max-w-full"
      defaultOpen={["preview"]}
      items={[
        {
          id: "preview",
          title: "What is a preview deployment?",
          content:
            "Every push to a branch other than main gets its own URL, so you can review a change before it ships.",
        },
        {
          id: "domains",
          title: "Can I use my own domain?",
          content:
            "Yes. Add it under Settings → Domains and point a CNAME at acme.dev. Certificates are issued for you.",
        },
        {
          id: "rollback",
          title: "How do I roll back?",
          content: "Open any earlier deployment and choose Promote. It takes effect in seconds.",
        },
        {
          id: "limits",
          title: "Are there build limits?",
          content: "Builds time out after 45 minutes and can use up to 8 GB of memory.",
        },
      ]}
    />
  );
}
