import { Select } from "./select";

const regions = [
  { value: "fra", label: "Frankfurt (eu-central)" },
  { value: "iad", label: "Washington (us-east)" },
  { value: "sin", label: "Singapore (ap-southeast)" },
  { value: "gru", label: "São Paulo (sa-east)", disabled: true },
];

export default function SelectDemo() {
  return (
    <div className="grid w-[560px] max-w-full grid-cols-1 gap-5 sm:grid-cols-2">
      <Select
        id="demo-region"
        label="Region"
        options={regions}
        defaultValue="fra"
        hint="Where your functions run."
      />
      <Select
        id="demo-role"
        label="Role"
        placeholder="Choose a role"
        options={[
          { value: "owner", label: "Owner" },
          { value: "member", label: "Member" },
          { value: "viewer", label: "Viewer" },
        ]}
        error="Pick a role to send the invite."
      />
      <Select
        id="demo-plan"
        label="Plan"
        options={[{ value: "pro", label: "Pro" }]}
        defaultValue="pro"
        disabled
      />
    </div>
  );
}
