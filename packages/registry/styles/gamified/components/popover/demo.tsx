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
          {/* A read-only well: sunk into the pane, so it reads as a slot, not a key. */}
          <input
            id="demo-share-url"
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
            className="h-9 min-w-0 flex-1 rounded-gm border-2 border-gm-line bg-gm-subtle px-3 text-[13px] font-semibold text-gm-muted outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-gm-primary focus-visible:ring-4 focus-visible:ring-gm-primary/20"
          />
          <button
            type="button"
            data-autofocus
            onClick={() => {
              void navigator.clipboard?.writeText(url).catch(() => {});
              setCopied(true);
            }}
            className="inline-flex h-9 w-[72px] shrink-0 items-center justify-center rounded-gm bg-gm-primary font-gm-display text-sm font-semibold text-gm-on-primary shadow-gm-primary transition-[background-color,translate,box-shadow] duration-100 hover:bg-gm-primary-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-1 active:shadow-none"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p
          className={`mt-3 text-[13px] ${copied ? "font-semibold text-gm-success" : "text-gm-muted"}`}
          aria-live="polite"
        >
          {copied ? "Link copied to the clipboard." : "The link expires in 7 days."}
        </p>
      </Popover>
    </div>
  );
}
