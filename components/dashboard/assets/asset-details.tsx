import { Asset } from "@/types/asset";
import { Label } from "@/components/ui/label";

interface AssetDetailsProps {
  asset: Asset;
}

export function AssetDetails({ asset }: AssetDetailsProps) {
  return (
    <div className="space-y-4">
      {/* ... existing asset details ... */}

      {asset.type === "vehicle" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>License Plate Number</Label>
            <p className="text-sm text-muted-foreground">
              {asset.licensePlateNumber}
            </p>
          </div>
          <div>
            <Label>Chassis Number</Label>
            <p className="text-sm text-muted-foreground">
              {asset.chassisNumber}
            </p>
          </div>
        </div>
      )}

      {/* ... rest of the details ... */}
    </div>
  );
}
