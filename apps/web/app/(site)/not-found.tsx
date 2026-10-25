import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div className="grid place-items-center py-24 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-muted">This style or component doesn't exist yet.</p>
        <Link href="/" className="text-sm underline underline-offset-4">
          Back to bahvo
        </Link>
      </div>
    </div>
  );
}
