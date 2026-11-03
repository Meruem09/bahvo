import { Switch } from "./switch";

export default function SwitchDemo() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5">
      <Switch
        id="demo-previews"
        label="Deploy previews"
        description="Build every pull request."
        defaultChecked
      />
      <Switch id="demo-digest" label="Weekly digest" description="A summary every Monday." />
      <Switch
        id="demo-sso"
        label="Single sign-on"
        description="Available on the Business plan."
        disabled
      />
    </div>
  );
}
