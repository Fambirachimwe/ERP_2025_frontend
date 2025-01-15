"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Asset } from "@/types/asset";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const router = useRouter();

  return (
    <Card
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{asset.assetId}</CardTitle>
        <Badge variant={asset.status === "active" ? "default" : "destructive"}>
          {asset.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium">{asset.model}</p>
          <p className="text-xs text-muted-foreground">
            {asset.manufacturer} - {asset.serialNumber}
          </p>
          <div className="flex justify-between text-xs">
            <span>Location: {asset.location}</span>
            <span>Dept: {asset.department}</span>
          </div>
          {asset.warrantyExpiry && (
            <p className="text-xs text-muted-foreground">
              Warranty expires:{" "}
              {formatDistanceToNow(new Date(asset.warrantyExpiry), {
                addSuffix: true,
              })}
            </p>
          )}
          {asset.type === "software" && (
            <>
              <p className="text-xs">Version: {asset.version}</p>
              <p className="text-xs">License: {asset.licenseKey}</p>
              {asset.expirationDate && (
                <p className="text-xs text-muted-foreground">
                  Expires:{" "}
                  {formatDistanceToNow(new Date(asset.expirationDate), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </>
          )}
          {asset.type === "vehicle" && asset.vehicleDetails && (
            <>
              <p className="text-xs">
                License Plate: {asset.vehicleDetails.licensePlateNumber}
              </p>
              <p className="text-xs">
                Chassis Number: {asset.vehicleDetails.chassisNumber}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
