"use client";

import { Button } from "@bahvo/ui/button";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 px-2.5 text-[13px]"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}
