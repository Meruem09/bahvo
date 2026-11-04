"use client";

import { useEffect, useState } from "react";
import { Popover } from "./popover";

const url = "acme-web-git-billing.acme.dev";

export default function PopoverDemo() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="flex h-[260px] w-[340px] max-w-full items-start">
      <Popover
        label="Share"
        defaultOpen
        title="Share preview"
        description="Anyone with the link can view this deployment."
        icon={
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M8 9.75V2.75M5.25 5.25 8 2.5l2.75 2.75M3.75 8.5v4.75h8.5V8.5" />
          </svg>
        }
      >
        <div className="flex gap-2">
          <label htmlFor="demo-share-url" className="sr-only">
            Preview link
          </label>
          <input
            id="demo-share-url"
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
            className="h-8 min-w-0 flex-1 rounded-mn border border-mn-line bg-mn-subtle px-2.5 text-[13px] text-mn-muted outline-none focus-visible:border-mn-accent focus-visible:ring-3 focus-visible:ring-mn-accent/20"
          />
          <button
            type="button"
            data-autofocus
            onClick={() => {
              void navigator.clipboard?.writeText(url).catch(() => {});
              setCopied(true);
            }}
            className="inline-flex h-8 w-[68px] shrink-0 items-center justify-center rounded-mn bg-mn-fg text-[13px] font-medium text-mn-inverse transition-colors hover:bg-mn-fg/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-[13px] text-mn-muted" aria-live="polite">
          {copied ? "Link copied to the clipboard." : "The link expires in 7 days."}
        </p>
      </Popover>
    </div>
  );
}
