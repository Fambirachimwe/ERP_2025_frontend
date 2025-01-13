"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { useUsers } from "@/lib/hooks/use-users";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const assignSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
});

interface AssignAssetDialogProps {
  assetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignAssetDialog({
  assetId,
  open,
  onOpenChange,
}: AssignAssetDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const form = useForm({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      userId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: { userId: string }) =>
      apiClient(`/assets/${assetId}/assign`, session, {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-history", assetId] });
      queryClient.invalidateQueries({ queryKey: ["asset", assetId] });
      toast.success("Asset assigned successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to assign asset");
      console.error("Assignment error:", error);
    },
  });

  const onSubmit = async (values: { userId: string }) => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Asset</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingUsers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingUsers
                              ? "Loading users..."
                              : "Select a user"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} - {user.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button type="submit" disabled={isLoading || isLoadingUsers}>
                {isLoading ? "Assigning..." : "Assign Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
