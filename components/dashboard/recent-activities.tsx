"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "@/types/activity";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities } from "@/lib/hooks/use-activities";

export function RecentActivities() {
  const { data: activities, isLoading } = useActivities();

  if (isLoading) {
    return <ActivitySkeleton />;
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {activities?.map((activity) => (
          <div key={activity._id} className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={
                  activity?.user
                    ? `https://api.dicebear.com/7.x/initials/svg?seed=${activity.user.firstName} ${activity.user.lastName}`
                    : ""
                }
                alt={
                  activity?.user
                    ? `${activity.user.firstName} ${activity.user.lastName}`
                    : "User Avatar"
                }
              />
              <AvatarFallback>
                {activity?.user
                  ? `${activity.user.firstName?.[0]}${activity.user.lastName?.[0]}`
                  : "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">
                  {activity?.user
                    ? `${activity.user.firstName} ${activity.user.lastName}`
                    : "Unknown User"}{" "}
                </span>
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4 pr-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
