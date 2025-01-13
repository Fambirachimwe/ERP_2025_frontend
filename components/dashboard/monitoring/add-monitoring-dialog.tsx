"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface Asset {
  _id: string;
  assetId: string;
  model: string;
  type: string;
  assignedTo?: {
    firstName: string;
    lastName: string;
  };
}

const monitoringSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  status: z.enum(["available", "in_use", "maintenance", "missing", "disposed"]),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
  nextMonitoringDate: z.string().min(1, "Next monitoring date is required"),
  issues: z.string().optional(),
  actionRequired: z.string().optional(),
  actionTaken: z.string().optional(),
});

interface AddMonitoringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMonitoringDialog({
  open,
  onOpenChange,
}: AddMonitoringDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof monitoringSchema>>({
    resolver: zodResolver(monitoringSchema),
    defaultValues: {
      assetId: "",
      status: "available",
      condition: "good",
      location: "",
      notes: "",
      nextMonitoringDate: "",
      issues: "",
      actionRequired: "",
      actionTaken: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof monitoringSchema>) =>
      apiClient(`/monitoring/${values.assetId}`, session, {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitoring-dashboard"] });
      toast.success("Monitoring record added successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to add monitoring record");
    },
  });

  const onSubmit = async (values: z.infer<typeof monitoringSchema>) => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: assets, isLoading: isLoadingAssets } = useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: () => apiClient("/assets", session),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Monitoring Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingAssets}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingAssets
                              ? "Loading assets..."
                              : "Select an asset"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets?.map((asset) => (
                        <SelectItem key={asset._id} value={asset._id}>
                          <div className="flex flex-col">
                            <span>
                              {asset.assetId} - {asset.model} ({asset.type})
                            </span>
                            {asset.assignedTo && (
                              <span className="text-xs text-muted-foreground">
                                Assigned to: {asset.assignedTo.firstName}{" "}
                                {asset.assignedTo.lastName}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in_use">In Use</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                        <SelectItem value="disposed">Disposed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issues</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe any issues found"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="actionRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Required</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What actions are needed?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actionTaken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Taken</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What actions were taken?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional notes or observations"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextMonitoringDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Monitoring Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Monitoring Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
