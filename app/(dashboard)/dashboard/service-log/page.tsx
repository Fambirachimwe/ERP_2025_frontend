"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { ServiceLogTable } from "@/components/dashboard/service-log/service-log-table";
import { DashboardShell } from "@/components/shell";
// import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ScheduleServiceDialog } from "@/components/dashboard/service-log/schedule-service-dialog";

export default function ServiceLogPage() {
  const { data: session } = useSession();
  const [currentTab, setCurrentTab] = useState<"all" | "due" | "upcoming">(
    "all"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets-service"],
    queryFn: () => apiClient("/assets/service-schedule", session),
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Service Log"
        description="Track and manage asset maintenance schedules"
      >
        <Button onClick={handleOpenDialog}>
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule Service
        </Button>
      </DashboardHeader>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) =>
          setCurrentTab(value as "all" | "due" | "upcoming")
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="due">Due Services</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming (7 Days)</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ServiceLogTable assets={assets} isLoading={isLoading} filter="all" />
        </TabsContent>
        <TabsContent value="due">
          <ServiceLogTable assets={assets} isLoading={isLoading} filter="due" />
        </TabsContent>
        <TabsContent value="upcoming">
          <ServiceLogTable
            assets={assets}
            isLoading={isLoading}
            filter="upcoming"
          />
        </TabsContent>
      </Tabs>

      <ScheduleServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </DashboardShell>
  );
}
