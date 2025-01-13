"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AssetMonitoringDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: monitoringHistory, isLoading } = useQuery({
    queryKey: ["asset-monitoring-history", id],
    queryFn: () => apiClient(`/monitoring/${id}/history`, session),
  });

  if (isLoading) return <DetailPageSkeleton />;

  const asset = monitoringHistory?.[0]?.assetId;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/monitoring")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Monitoring
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Monitoring History
          </h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Asset ID</p>
              <p className="text-lg">{asset?.assetId}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="text-lg">{asset?.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Model</p>
              <p className="text-lg">{asset?.model}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Actions Required</TableHead>
                <TableHead>Actions Taken</TableHead>
                <TableHead>Monitored By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitoringHistory?.map((record: any) => (
                <TableRow key={record._id}>
                  <TableCell>
                    {format(new Date(record.monitoredAt), "PPP")}
                  </TableCell>
                  <TableCell>
                    <Badge>{record.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{record.condition}</Badge>
                  </TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{record.issues || "None"}</TableCell>
                  <TableCell>{record.actionRequired || "None"}</TableCell>
                  <TableCell>{record.actionTaken || "None"}</TableCell>
                  <TableCell>
                    {record.monitoredBy.firstName} {record.monitoredBy.lastName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
