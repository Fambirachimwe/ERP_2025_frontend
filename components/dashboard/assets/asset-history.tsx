"use client";

import { format } from "date-fns";
import { Timeline } from "@/components/ui/timeline";
import { UserCircle } from "lucide-react";

interface AssetHistoryProps {
  history: Array<{
    _id: string;
    action: "assigned" | "unassigned";
    assignedTo: {
      firstName: string;
      lastName: string;
      email: string;
    };
    date: string;
    note?: string;
  }>;
}

export function AssetHistory({ history }: AssetHistoryProps) {
  const getTimelineItems = () => {
    return history.map((item) => ({
      title: item.action === "assigned" ? "Assigned To" : "Assigned To",
      description: `${item.assignedTo.firstName} ${item.assignedTo.lastName}`,
      date: format(new Date(item.date), "PPP p"),
      icon: <UserCircle className="h-4 w-4" />,
      note: item.note,
    }));
  };

  return (
    <div className="space-y-4">
      <Timeline items={getTimelineItems() as any} />
    </div>
  );
}
