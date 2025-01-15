"use client";

import { useLeaveBalance } from "@/lib/hooks/use-leave-balance";
import { useAssignedAssets } from "@/lib/hooks/use-assigned-assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Monitor, Calendar, AlertCircle } from "lucide-react";

export function UserDashboard() {
  const { data: leaveBalance, isLoading: leaveBalanceLoading } =
    useLeaveBalance();

  console.log(leaveBalance);
  const { data: assignedAssets, isLoading: assetsLoading } =
    useAssignedAssets();

  if (leaveBalanceLoading || assetsLoading) {
    return <UserDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Leave Balances Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Leave Balances</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Annual Leave Balance
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveBalance?.balances.annual.remaining}
              </div>
              <p className="text-xs text-muted-foreground">days remaining</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="inline-block mr-2">
                  Used: {leaveBalance?.balances.annual.used}
                </span>
                <span className="inline-block">
                  Pending: {leaveBalance?.balances.annual.pending}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sick Leave Balance
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveBalance?.balances.sick.remaining}
              </div>
              <p className="text-xs text-muted-foreground">days remaining</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="inline-block mr-2">
                  Used: {leaveBalance?.balances.sick.used}
                </span>
                <span className="inline-block">
                  Pending: {leaveBalance?.balances.sick.pending}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assigned Assets Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Assigned Assets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignedAssets?.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>No assets assigned</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            assignedAssets?.map((asset) => (
              <Card key={asset._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {asset.model}
                  </CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">Asset ID: {asset.assetId}</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.manufacturer}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>{asset.status}</Badge>
                      {asset.warrantyExpiry && (
                        <span className="text-xs text-muted-foreground">
                          Warranty expires{" "}
                          {formatDistanceToNow(new Date(asset.warrantyExpiry), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function UserDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="h-7 w-36 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
