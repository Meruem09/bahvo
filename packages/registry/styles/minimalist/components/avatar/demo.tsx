import { Avatar } from "./avatar";

const team = ["Alex Chen", "Maya Ortiz", "Sam Lee", "Priya Nair"];

export default function AvatarDemo() {
  return (
    <div className="flex flex-col items-start gap-6 font-mn">
      <div className="flex items-end gap-4">
        <Avatar name="Alex Chen" size="sm" />
        <Avatar name="Alex Chen" size="md" status="online" />
        <Avatar name="Alex Chen" size="lg" status="away" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {team.map((name) => (
            <Avatar key={name} name={name} className="rounded-full ring-2 ring-mn-bg" />
          ))}
        </div>
        <span className="text-[13px] text-mn-muted">4 members</span>
      </div>
      <div className="flex items-center gap-3 rounded-mn-lg border border-mn-line bg-mn-surface px-4 py-3">
        <Avatar name="Maya Ortiz" status="online" />
        <div className="text-sm leading-tight">
          <p className="font-medium text-mn-fg">Maya Ortiz</p>
          <p className="text-[13px] text-mn-muted">Online · Design</p>
        </div>
      </div>
    </div>
  );
}
