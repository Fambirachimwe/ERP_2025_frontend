"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { Asset } from "@/types/asset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils/handle-error";

const assetSchema = z.object({
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  location: z.string().min(1, "Location is required"),
  department: z.string().min(1, "Department is required"),
  status: z.string().min(1, "Status is required"),
  price: z.number().optional(),
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  licenseKey: z.string().optional(),
  version: z.string().optional(),
  expirationDate: z.string().optional(),
  vehicleDetails: z
    .object({
      licensePlateNumber: z.string(),
      chassisNumber: z.string(),
    })
    .optional(),
});

interface EditAssetDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAssetDialog({
  asset,
  open,
  onOpenChange,
}: EditAssetDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      model: asset.model,
      manufacturer: asset.manufacturer,
      serialNumber: asset.serialNumber,
      location: asset.location,
      department: asset.department,
      status: asset.status,
      price: asset.price || undefined,
      purchaseDate: asset.purchaseDate || "",
      warrantyExpiry: asset.warrantyExpiry || "",
      licenseKey: asset.licenseKey || "",
      version: asset.version || "",
      expirationDate: asset.expirationDate || "",
      vehicleDetails: asset.vehicleDetails,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof assetSchema>) =>
      apiClient(`/assets/${asset._id}`, session, {
        method: "PUT",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset", asset._id] });
      toast.success("Asset updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      handleApiError(error, "Failed to update asset");
    },
  });

  const onSubmit = async (values: z.infer<typeof assetSchema>) => {
    setIsLoading(true);
    try {
      const updatedValues = {
        ...values,
        type: asset.type,
        assetId: asset.assetId,
        assignedTo: asset.assignedTo,
        serviceHistory: asset.serviceHistory,
      };

      await mutation.mutateAsync(updatedValues);
    } finally {
      setIsLoading(false);
    }
  };

  const isSoftware = asset.type === "software";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="disposed">Disposed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Expiry</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSoftware && (
                <>
                  <FormField
                    control={form.control}
                    name="licenseKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Key</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Expiration</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
