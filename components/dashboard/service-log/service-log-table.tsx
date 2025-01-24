"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  formatDistanceToNow,
  isPast,
  addDays,
  isWithinInterval,
} from "date-fns";
import { useRouter } from "next/navigation";

interface ServiceHistory {
  serviceDate: string;
  serviceProvider: string;
  serviceDetails: string;
  cost: number;
  nextServiceDue: string;
  status: "scheduled" | "completed" | "cancelled";
  _id: string;
}

interface Asset {
  _id: string;
  assetId: string;
  assetType: string;
  model: string;
  location: string;
  department: string;
  serviceHistory: ServiceHistory[];
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  serviceStatus: string;
  serviceProvider: string;
  serviceDetails: string;
}

interface ServiceLogTableProps {
  assets: Asset[];
  isLoading: boolean;
  filter: "all" | "due" | "upcoming";
}

export function ServiceLogTable({
  assets,
  isLoading,
  filter,
}: ServiceLogTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filterAssets = (assets: Asset[]) => {
    const now = new Date();
    const in7Days = addDays(now, 7);

    switch (filter) {
      case "due":
        return assets?.filter((asset) =>
          isPast(new Date(asset.nextMaintenanceDate))
        );
      case "upcoming":
        return assets?.filter((asset) => {
          const serviceDate = new Date(asset.nextMaintenanceDate);
          return isWithinInterval(serviceDate, { start: now, end: in7Days });
        });
      default:
        return assets;
    }
  };

  const filteredAssets = filterAssets(assets);

  console.log("assets from the service table ", filteredAssets);

  const getServiceStatus = (nextServiceDate: string, status: string) => {
    const date = new Date(nextServiceDate);
    const isOverdue = isPast(date);

    if (status === "completed") {
      return {
        label: isOverdue ? "Service Due" : "Completed",
        variant: isOverdue ? "destructive" : "success",
      };
    }

    if (status === "scheduled") {
      return {
        label: "Scheduled",
        variant: "default",
      };
    }

    return {
      label: "Cancelled",
      variant: "secondary",
    };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset ID</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Last Service</TableHead>
            <TableHead>Service Provider</TableHead>
            <TableHead>Next Service</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets?.map((asset) => {
            const serviceStatus = getServiceStatus(
              asset.nextMaintenanceDate,
              asset.serviceStatus
            );

            return (
              <TableRow
                key={asset._id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => router.push(`/dashboard/assets/${asset._id}`)}
              >
                <TableCell className="font-medium">{asset.assetId}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell className="capitalize">{asset.assetType}</TableCell>
                <TableCell>
                  {asset.lastMaintenanceDate
                    ? formatDistanceToNow(new Date(asset.lastMaintenanceDate), {
                        addSuffix: true,
                      })
                    : "Never"}
                </TableCell>
                <TableCell>{asset.serviceProvider}</TableCell>
                <TableCell>
                  {asset.nextMaintenanceDate
                    ? formatDistanceToNow(new Date(asset.nextMaintenanceDate), {
                        addSuffix: true,
                      })
                    : "Not scheduled"}
                </TableCell>
                <TableCell>
                  <Badge variant={serviceStatus.variant}>
                    {serviceStatus.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
