"use client";

import { Slider } from "./slider";

export default function SliderDemo() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-7">
      <Slider label="Volume" defaultValue={64} format={(value) => `${value}%`} />
      <Slider
        label="Max upload size"
        min={5}
        max={100}
        step={5}
        defaultValue={25}
        format={(value) => `${value} MB`}
        hint="Larger files are rejected before upload."
      />
      <Slider label="Seats" defaultValue={12} max={50} disabled />
    </div>
  );
}
