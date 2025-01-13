import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";

interface TimelineProps {
  items: {
    title: string;
    description?: string;
    status: "complete" | "current" | "upcoming";
    date?: string;
    icon?: React.ReactNode;
  }[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <div key={index} className="relative pb-8">
          {index !== items.length - 1 && (
            <span
              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
          )}
          <div className="relative flex items-start space-x-3">
            <div>
              <div
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full",
                  {
                    "bg-primary": item.status === "complete",
                    "bg-secondary": item.status === "current",
                    "bg-muted": item.status === "upcoming",
                  }
                )}
              >
                {item.icon ? (
                  item.icon
                ) : item.status === "complete" ? (
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                ) : item.status === "current" ? (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900">
                {item.title}
              </div>
              {item.description && (
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </div>
              )}
              {item.date && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {item.date}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
