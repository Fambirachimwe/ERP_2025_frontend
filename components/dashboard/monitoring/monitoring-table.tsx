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
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { RecordMonitoringDialog } from "./record-monitoring-dialog";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface MonitoredAsset {
  _id: string;
  assetId: {
    _id: string;
    assetId: string;
    type: string;
    model: string;
    manufacturer: string;
    status: string;
    location: string;
  };
  status: string;
  condition: string;
  monitoredAt: string;
  nextMonitoringDate: string;
  monitoredBy: {
    firstName: string;
    lastName: string;
  };
  issues?: string[];
  actionRequired?: string;
  actionTaken?: string;
}

interface MonitoringTableProps {
  assets: MonitoredAsset[];
}

export function MonitoringTable({ assets }: MonitoringTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<MonitoredAsset | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleMonitorClick = (asset: MonitoredAsset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (assetId: string) => {
    router.push(`/dashboard/monitoring/asset/${assetId}`);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Monitored</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Monitored By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((record) => (
              <TableRow
                key={record._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewDetails(record.assetId._id)}
              >
                <TableCell>{record.assetId.assetId}</TableCell>
                <TableCell className="capitalize">
                  {record.assetId.type}
                </TableCell>
                <TableCell>{record.assetId.model}</TableCell>
                <TableCell>{record.assetId.location}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(record.monitoredAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(record.nextMonitoringDate), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.status === "available" ? "default" : "secondary"
                    }
                  >
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.condition === "excellent"
                        ? "default"
                        : record.condition === "good"
                        ? "secondary"
                        : record.condition === "fair"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {record.condition}
                  </Badge>
                </TableCell>
                <TableCell>
                  {record.monitoredBy.firstName} {record.monitoredBy.lastName}
                </TableCell>
                <TableCell className="text-right relative p-0">
                  <ContextMenu>
                    <ContextMenuTrigger className="h-full w-full flex items-center justify-end px-4 py-2">
                      <span className="flex items-center gap-2">•••</span>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMonitorClick(record);
                        }}
                      >
                        <span className="flex items-center">
                          Record Monitoring
                        </span>
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(record.assetId._id);
                        }}
                      >
                        <span className="flex items-center">View Details</span>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RecordMonitoringDialog
        asset={selectedAsset?.assetId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
