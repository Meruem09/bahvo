import { RadioGroup } from "./radio-group";

export default function RadioGroupDemo() {
  return (
    <RadioGroup
      legend="Visibility"
      name="demo-visibility"
      defaultValue="private"
      className="w-[360px] max-w-full"
      options={[
        {
          value: "private",
          label: "Private",
          description: "Only members of this team can see it.",
        },
        {
          value: "public",
          label: "Public",
          description: "Anyone with the link can view it.",
        },
        {
          value: "internal",
          label: "Internal",
          description: "Everyone at Acme. Needs the Enterprise plan.",
          disabled: true,
        },
      ]}
    />
  );
}
