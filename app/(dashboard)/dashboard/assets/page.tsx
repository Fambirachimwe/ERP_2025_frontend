"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetCard } from "@/components/dashboard/assets/asset-card";
import { AssetsTable } from "@/components/dashboard/assets/assets-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Asset } from "@/types/asset";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table, Plus, Upload, Download } from "lucide-react";
import { useState } from "react";
import { AddAssetDialog } from "@/components/dashboard/assets/add-asset-dialog";
import { UploadAssetsDialog } from "@/components/dashboard/assets/upload-assets-dialog";

export default function AssetsPage() {
  const { data: session, status } = useSession();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { data: assets, isLoading } = useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: () => apiClient("/assets", session),
    enabled: status === "authenticated",
  });

  if (isLoading) return <AssetsPageSkeleton />;

  const itAssets =
    assets?.filter((asset) =>
      ["laptop", "monitor", "cpu", "mouse", "hardDrive"].includes(
        asset.assetType as string
      )
    ) || [];

  const softwareAssets =
    assets?.filter((asset) => asset.assetType === "software") || [];

  const furnitureAssets =
    assets?.filter((asset) => asset.assetType === "furniture") || [];

  const vehicleAssets =
    assets?.filter((asset) => asset.assetType === "vehicle") || [];

  const otherAssets =
    assets?.filter(
      (asset) =>
        ![
          "laptop",
          "monitor",
          "cpu",
          "mouse",
          "hardDrive",
          "software",
          "furniture",
          "vehicle",
        ].includes(asset.assetType as string)
    ) || [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 mr-4">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
            >
              <Table className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Assets
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/api/assets/export", "_blank")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="it">IT Equipment</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="furniture">Furniture</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicles</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assets?.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetsTable assets={assets || []} />
          )}
        </TabsContent>

        <TabsContent value="it" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {itAssets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetsTable assets={itAssets} />
          )}
        </TabsContent>

        <TabsContent value="software" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {softwareAssets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetsTable assets={softwareAssets} />
          )}
        </TabsContent>

        <TabsContent value="furniture" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {furnitureAssets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetsTable assets={furnitureAssets} />
          )}
        </TabsContent>

        <TabsContent value="vehicle" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicleAssets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetsTable assets={vehicleAssets} />
          )}
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherAssets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetsTable assets={otherAssets} />
          )}
        </TabsContent>
      </Tabs>

      <AddAssetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      <UploadAssetsDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}

function AssetsPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
