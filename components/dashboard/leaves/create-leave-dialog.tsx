"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { SignaturePadComponent } from "./signature-pad";
import { useSupervisors } from "@/lib/hooks/use-supervisors";

const leaveSchema = z.object({
  supervisorId: z.string().min(1, "Supervisor is required"),
  absenceType: z.enum([
    "Sick",
    "Vacation/Personal",
    "Study",
    "Maternity/Paternity",
    "Compassionate",
    "Special",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required"),
});

interface CreateLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLeaveDialog({
  open,
  onOpenChange,
}: CreateLeaveDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [signature, setSignature] = useState("");

  const { data: supervisors = [], isLoading: isLoadingSupervisors } =
    useSupervisors();

  console.log(supervisors);

  // Filter out the current user from supervisors list
  const availableSupervisors = supervisors.filter(
    (supervisor) => supervisor._id !== session?.user?._id
  );

  console.log(availableSupervisors);

  const form = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      supervisorId: "",
      absenceType: "Vacation/Personal",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof leaveSchema>) =>
      apiClient("/leaves", session, {
        method: "POST",
        body: JSON.stringify({
          ...values,
          employeeSignature: signature,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Leave request submitted successfully");
      onOpenChange(false);
      form.reset();
      setSignature("");
    },
    onError: () => {
      toast.error("Failed to submit leave request");
    },
  });

  const onSubmit = async (values: z.infer<typeof leaveSchema>) => {
    if (!signature) {
      toast.error("Please provide your signature before submitting");
      return;
    }

    const formData = {
      ...values,
      absenceType: values.absenceType as
        | "Sick"
        | "Vacation/Personal"
        | "Study"
        | "Maternity/Paternity"
        | "Compassionate"
        | "Special",
      employeeSignature: signature,
    };

    await mutation.mutateAsync(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      isLoadingSupervisors || availableSupervisors.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingSupervisors
                              ? "Loading supervisors..."
                              : availableSupervisors.length === 0
                              ? "No supervisors available"
                              : "Select supervisor"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSupervisors.map((supervisor) => (
                        <SelectItem key={supervisor._id} value={supervisor._id}>
                          {supervisor.firstName} {supervisor.lastName} -{" "}
                          {supervisor.department}
                          {supervisor.roles?.includes("supervisor") &&
                            " (Supervisor)"}
                          {supervisor.roles?.includes("administrator") &&
                            " (Admin)"}
                          {supervisor.roles?.includes("sysAdmin") &&
                            " (System Admin)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="absenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Vacation/Personal">
                        Vacation/Personal Leave
                      </SelectItem>
                      <SelectItem value="Study">Study Leave</SelectItem>
                      <SelectItem value="Maternity/Paternity">
                        Maternity/Paternity Leave
                      </SelectItem>
                      <SelectItem value="Compassionate">
                        Compassionate Leave
                      </SelectItem>
                      <SelectItem value="Special">Special Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Signature</FormLabel>
              <SignaturePadComponent
                onSignatureComplete={(signatureData) =>
                  setSignature(signatureData)
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
