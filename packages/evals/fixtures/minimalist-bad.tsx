// Fixture: a deliberately off-style answer, to prove the scoring catches it.
export function Switch({ label }: { label: string }) {
  return (
    <div
      onClick={() => {}}
      className="flex items-center gap-2 rounded-xl bg-gray-100 p-2 shadow-lg"
    >
      <button type="button" className="h-6 w-10 rounded-full bg-blue-500" />
      <span className="text-[#333]">{label}</span>
    </div>
  );
}

export default function Demo() {
  return <Switch label="Notifications" />;
}
