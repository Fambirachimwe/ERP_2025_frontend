"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  Users,
  PlusCircle,
  ArrowLeft,
  Plus,
  UserMinus,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { EditAssetDialog } from "@/components/dashboard/assets/edit-asset-dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Asset, AssetHistory } from "@/types/asset";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssignAssetDialog } from "@/components/dashboard/assets/assign-asset-dialog";
import { AddServiceHistoryDialog } from "@/components/dashboard/assets/add-service-history-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AssetDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isServiceHistoryDialogOpen, setIsServiceHistoryDialogOpen] =
    useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: asset, isLoading } = useQuery<Asset>({
    queryKey: ["asset", id],
    queryFn: () => apiClient(`/assets/${id}`, session),
    enabled: status === "authenticated",
  });

  const { data: history, isLoading: isHistoryLoading } = useQuery<
    AssetHistory[]
  >({
    queryKey: ["asset-history", id],
    queryFn: () => apiClient(`/assets/${id}/history`, session),
    enabled: status === "authenticated",
  });

  const unassignMutation = useMutation({
    mutationFn: async () => {
      return apiClient(`/assets/${id}/unassign`, session, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["asset", id] });
      queryClient.invalidateQueries({ queryKey: ["assetHistory", id] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["assignedAssets"] });

      toast.success("Asset unassigned successfully");
      setIsUnassignDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error unassigning asset:", error);
      toast.error("Failed to unassign asset");
    },
  });

  const handleUnassign = () => {
    unassignMutation.mutate();
  };

  if (isLoading) return <AssetDetailSkeleton />;
  if (!asset) return <div>Asset not found</div>;

  const isAdmin = session?.user?.roles?.some(
    (role) => role === "sysAdmin" || role === "administrator"
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/assets")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Asset Details</h2>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Asset
          </Button>
        )}
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Assignment History</TabsTrigger>
          <TabsTrigger value="service-history">Service History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Asset ID:</span>
                  <span>{asset.assetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{asset.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Model:</span>
                  <span>{asset.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Manufacturer:</span>
                  <span>{asset.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Serial Number:</span>
                  <span>{asset.serialNumber}</span>
                </div>
                {asset.type === "vehicle" && asset.licensePlateNumber && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">License Plate:</span>
                      <span>{asset.licensePlateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Chassis Number:</span>
                      <span>{asset.vehicleDetails?.chassisNumber}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{asset.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Department:</span>
                  <span>{asset.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      asset.status === "active" ? "default" : "destructive"
                    }
                  >
                    {asset.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location & Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Location:</span>
                  <span>{asset.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Department:</span>
                  <span>{asset.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Assigned To:</span>
                  <span>
                    {asset.assignedTo
                      ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName}`
                      : "Unassigned"}
                  </span>
                </div>
                {asset.warrantyExpiry && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Warranty Expires:</span>
                    <span>
                      {formatDistanceToNow(new Date(asset.warrantyExpiry), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {asset.type === "software" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Software Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Version:</span>
                    <span>{asset.version}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">License Key:</span>
                    <span>{asset.licenseKey}</span>
                  </div>
                  {asset.expirationDate && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">License Expires:</span>
                      <span>
                        {formatDistanceToNow(new Date(asset.expirationDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assignment History</CardTitle>
              <div className="flex items-center space-x-2">
                {isHistoryLoading && <Skeleton className="h-4 w-[100px]" />}
                {isAdmin && (
                  <Button size="sm" onClick={() => setIsAssignDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Assignment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {history?.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                    No assignment history found
                  </div>
                ) : (
                  <div className="space-y-8">
                    {history?.map((record) => (
                      <div
                        key={record._id}
                        className="flex items-start justify-between border-b pb-8 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {record.type === "assigned"
                                ? "Assigned to"
                                : "Unassigned from"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.assignedTo
                                ? `${record.assignedTo.firstName} ${record.assignedTo.lastName}`
                                : "No user"}
                            </p>
                            {record.assignedTo?.email && (
                              <p className="text-xs text-muted-foreground">
                                {record.assignedTo.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {format(new Date(record?.date || ""), "PPP")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(record?.date || ""), "pp")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <AssignAssetDialog
            assetId={id as string}
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
          />
        </TabsContent>

        <TabsContent value="service-history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Service History</h3>
            <Button onClick={() => setIsServiceHistoryDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service History
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Next Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asset?.serviceHistory?.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      {format(new Date(service.serviceDate || ""), "PPP")}
                    </TableCell>
                    <TableCell>{service.serviceProvider}</TableCell>
                    <TableCell>{service.serviceDetails}</TableCell>
                    <TableCell>${service.cost}</TableCell>
                    <TableCell>
                      {format(new Date(service.nextServiceDue || ""), "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <EditAssetDialog
        asset={asset}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AddServiceHistoryDialog
        assetId={asset?._id}
        open={isServiceHistoryDialogOpen}
        onOpenChange={setIsServiceHistoryDialogOpen}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Assignment</CardTitle>
          {asset?.assignedTo && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUnassignDialogOpen(true)}
              className="text-destructive"
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Unassign
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {asset?.assignedTo ? (
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>
                  {`${asset.assignedTo.firstName[0]}${asset.assignedTo.lastName[0]}`}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {asset.assignedTo.firstName} {asset.assignedTo.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {asset.assignedTo.email}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not currently assigned to anyone
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isUnassignDialogOpen}
        onOpenChange={setIsUnassignDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unassign Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the current assignment? This will
              make the asset available for reassignment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUnassignDialogOpen(false)}
              disabled={unassignMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnassign}
              disabled={unassignMutation.isPending}
            >
              {unassignMutation.isPending ? "Unassigning..." : "Unassign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssetDetailSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
