"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/user";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const rolesSchema = z.object({
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

interface EditUserRolesDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserRolesDialog({
  user,
  open,
  onOpenChange,
}: EditUserRolesDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      roles: user.roles,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof rolesSchema>) =>
      apiClient(`/users/${user._id}/roles`, session, {
        method: "PUT",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User roles updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update user roles");
    },
  });

  const onSubmit = async (values: z.infer<typeof rolesSchema>) => {
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
          <DialogTitle>Edit User Roles</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="space-y-2">
                    {["user", "supervisor", "administrator", "sysAdmin"].map(
                      (role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value.includes(role)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, role]);
                              } else {
                                field.onChange(
                                  field.value.filter((r) => r !== role)
                                );
                              }
                            }}
                          />
                          <span className="capitalize">{role}</span>
                        </div>
                      )
                    )}
                  </div>
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
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
