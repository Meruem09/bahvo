import { Avatar } from "./avatar";

const team = ["Alex Chen", "Maya Ortiz", "Sam Lee", "Priya Nair"];

export default function AvatarDemo() {
  return (
    <div className="flex flex-col items-start gap-6 font-gm">
      <div className="flex items-end gap-4">
        <Avatar name="Alex Chen" size="sm" />
        <Avatar name="Alex Chen" size="md" status="online" />
        <Avatar name="Alex Chen" size="lg" status="away" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {team.map((name) => (
            <Avatar key={name} name={name} className="rounded-full ring-2 ring-gm-bg" />
          ))}
        </div>
        <span className="text-[13px] font-semibold text-gm-muted">4 members</span>
      </div>
      <div className="flex items-center gap-3 rounded-gm-lg border-2 border-gm-line bg-gm-surface px-4 py-3 shadow-gm">
        <Avatar name="Maya Ortiz" status="online" />
        <div className="text-sm leading-tight">
          <p className="font-semibold text-gm-fg">Maya Ortiz</p>
          <p className="text-[13px] text-gm-muted">Online · Design</p>
        </div>
      </div>
    </div>
  );
}
