"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Asset } from "@/types/asset";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Laptop,
  Monitor,
  Cpu,
  Mouse,
  HardDrive,
  Car,
  Armchair,
  AppWindow,
  Printer,
  FileText,
  Phone,
  Tablet,
} from "lucide-react";

interface AssetsTableProps {
  assets: Asset[];
}

const assetTypeIcons: Record<string, React.ElementType> = {
  laptop: Laptop,
  monitor: Monitor,
  cpu: Cpu,
  mouse: Mouse,
  hardDrive: HardDrive,
  vehicle: Car,
  furniture: Armchair,
  software: AppWindow,
  printer: Printer,
  other: FileText,
  phone: Phone,
  tablet: Tablet,
};

export function AssetsTable({ assets }: AssetsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter assets based on search query
  const filteredAssets = assets.filter((asset) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      asset.assetId.toLowerCase().includes(searchTerm) ||
      asset.model.toLowerCase().includes(searchTerm) ||
      asset.manufacturer.toLowerCase().includes(searchTerm) ||
      asset.location.toLowerCase().includes(searchTerm) ||
      asset.department.toLowerCase().includes(searchTerm) ||
      (asset.assignedTo &&
        `${asset.assignedTo.firstName} ${asset.assignedTo.lastName}`
          .toLowerCase()
          .includes(searchTerm))
    );
  });

  const getAssetIcon = (type: string) => {
    const IconComponent = assetTypeIcons[type];
    return IconComponent ? (
      <div className="flex items-center gap-2">
        <IconComponent className="h-4 w-4" />
        <span className="capitalize">{type}</span>
      </div>
    ) : (
      <span className="capitalize">{type}</span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search assets by ID, model, manufacturer, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Warranty</TableHead> */}
              <TableHead>Assigned To</TableHead>
              {/* <TableHead>Additional Details</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow
                key={asset._id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => router.push(`/dashboard/assets/${asset._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/dashboard/assets/${asset._id}`);
                  }
                }}
              >
                <TableCell className="font-medium">{asset.assetId}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell>{getAssetIcon(asset.assetType || "")}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.department}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      asset.status === "available" ? "default" : "destructive"
                    }
                  >
                    {asset.status}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  {asset.warrantyExpiry
                    ? formatDistanceToNow(new Date(asset.warrantyExpiry), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </TableCell> */}
                <TableCell>
                  {asset.assignedTo
                    ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName}`
                    : "Unassigned"}
                </TableCell>
                {/* <TableCell>
                  {asset.type === "vehicle" && asset.vehicleDetails && (
                    <span className="text-sm">
                      LP: {asset.vehicleDetails.licensePlate}
                      <br />
                      CN: {asset.vehicleDetails.chassisNumber}
                    </span>
                  )}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
