import { Checkbox } from "./checkbox";

export default function CheckboxDemo() {
  return (
    <fieldset className="flex w-[360px] max-w-full flex-col gap-4 font-mn">
      <legend className="mb-3 text-[13px] font-medium text-mn-muted">Notifications</legend>
      <Checkbox
        id="demo-deploys"
        label="Deployments"
        description="When a deploy succeeds or fails."
        defaultChecked
      />
      <Checkbox id="demo-comments" label="Comments" description="When someone replies to you." />
      <Checkbox
        id="demo-billing"
        label="Billing"
        description="Managed by your organization owner."
        defaultChecked
        disabled
      />
    </fieldset>
  );
}
