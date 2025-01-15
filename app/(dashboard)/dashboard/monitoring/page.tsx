"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitoringTable } from "@/components/dashboard/monitoring/monitoring-table";
import { MonitoringDashboard } from "@/components/dashboard/monitoring";
import { AddMonitoringDialog } from "@/components/dashboard/monitoring/add-monitoring-dialog";
import { DashboardData, MonitoredAsset } from "@/types/monitoring";

export default function MonitoringPage() {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: stats, isLoading } = useQuery<DashboardData>({
    queryKey: ["monitoring-dashboard"],
    queryFn: () => apiClient("/monitoring/dashboard", session),
    enabled: !!session,
  });

  const { data: monitoredAssets = [], isLoading: isAssetsLoading } = useQuery<
    MonitoredAsset[]
  >({
    queryKey: ["monitored-assets"],
    queryFn: () => apiClient("/monitoring/assets", session),
    enabled: !!session,
  });

  if (isLoading || isAssetsLoading) return <MonitoringPageSkeleton />;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Asset Monitoring</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Monitoring
        </Button>
      </div>

      <MonitoringDashboard
        data={
          stats || {
            dueForMonitoring: [],
            assetsByStatus: [],
            assetsWithIssues: [],
            totalAssets: 0,
            activeMonitoring: 0,
            pendingService: 0,
            issuesReported: 0,
          }
        }
      />

      <Tabs defaultValue="due" className="space-y-4">
        <TabsList>
          <TabsTrigger value="due">Due for Monitoring</TabsTrigger>
          <TabsTrigger value="monitored">Monitored Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="due">
          <Card>
            <CardHeader>
              <CardTitle>Assets Due for Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <MonitoringTable assets={stats?.dueForMonitoring || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitored">
          <Card>
            <CardHeader>
              <CardTitle>Monitored Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <MonitoringTable assets={monitoredAssets || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddMonitoringDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}

function MonitoringPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
