import { Input } from "./input";

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" />
      <path d="m10.25 10.25 3 3" strokeLinecap="round" />
    </svg>
  );
}

export default function InputDemo() {
  return (
    <div className="grid w-[560px] max-w-full grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
      <Input
        id="demo-email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        hint="We'll send the invite here."
      />
      <Input id="demo-search" label="Search" placeholder="Find a project" icon={<SearchIcon />} />
      <Input
        id="demo-username"
        label="Username"
        defaultValue="admin"
        error="That username is taken."
      />
      <Input id="demo-region" label="Region" defaultValue="Frankfurt (eu-central)" disabled />
    </div>
  );
}
