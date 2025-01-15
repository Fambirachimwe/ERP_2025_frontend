import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  status: string;
  date?: string;
  icon?: React.ReactNode;
  comments?: string;
}

export function TimelineItem({
  title,
  status,
  date,
  icon,
  comments,
}: TimelineItemProps) {
  return (
    <div className="flex gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
          {icon}
        </div>
        <div className="flex-1 w-[2px] bg-border" />
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <div className="flex items-center justify-between gap-4">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">
            {date && format(new Date(date), "PPP")}
          </div>
        </div>
        <div
          className={cn("text-sm", {
            "text-green-500": status === "approved",
            "text-red-500": status === "rejected",
            "text-yellow-500": status === "pending",
          })}
        >
          Status: {status}
        </div>
        {comments && (
          <div className="text-sm text-muted-foreground">{comments}</div>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  items?: {
    title: string;
    status?: string;
    date: string;
    icon: React.ReactNode;
    comments?: string;
  }[];
  children?: React.ReactNode;
}

export function Timeline({ items, children }: TimelineProps) {
  if (items) {
    return (
      <div className="relative space-y-4">
        {items.map((item, index) => (
          <TimelineItem
            key={index}
            title={item.title}
            status={item.status || ""}
            date={item.date}
            icon={item.icon}
            comments={item.comments}
          />
        ))}
      </div>
    );
  }
  return <div className="relative space-y-4">{children}</div>;
}
