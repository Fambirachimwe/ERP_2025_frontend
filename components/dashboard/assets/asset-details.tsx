import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Asset } from "@/types/asset";
import { Label } from "@/components/ui/label";

interface AssetDetailsProps {
  asset: Asset;
}

export function AssetDetails({ asset }: AssetDetailsProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check if user is admin or sysAdmin
  const isAuthorized = session?.user?.roles?.some((role) =>
    ["administrator", "sysAdmin"].includes(role)
  );

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiClient(`/assets/${asset._id}`, session, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset deleted successfully");
      router.push("/dashboard/assets");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete asset");
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      deleteMutation.mutate();
    }
  };

  console.log(asset);

  return (
    <div className="space-y-4">
      {/* ... existing asset details ... */}

      {asset.type === "vehicle" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>License Plate Number</Label>
            <p className="text-sm text-muted-foreground">
              {asset.vehicleDetails?.licensePlateNumber}
            </p>
          </div>
          <div>
            <Label>Chassis Number</Label>
            <p className="text-sm text-muted-foreground">
              {asset.vehicleDetails?.chassisNumber}
            </p>
          </div>
        </div>
      )}

      {isAuthorized && (
        <div className="mt-6">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteMutation.isPending ? "Deleting..." : "Delete Asset"}
          </Button>
        </div>
      )}

      {/* ... rest of the details ... */}
    </div>
  );
}
