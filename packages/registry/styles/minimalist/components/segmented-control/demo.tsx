import { SegmentedControl } from "./segmented-control";

export default function SegmentedControlDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <SegmentedControl
        label="Range"
        name="demo-range"
        defaultValue="week"
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "year", label: "Year" },
        ]}
      />
      <SegmentedControl
        label="Layout"
        name="demo-layout"
        size="sm"
        options={[
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
          { value: "board", label: "Board", disabled: true },
        ]}
      />
    </div>
  );
}
