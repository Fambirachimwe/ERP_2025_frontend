"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { Leave } from "@/types/leave";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SignaturePadComponent } from "./signature-pad";

interface DisapproveLeaveDialogProps {
  leave: Leave | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApiError {
  message: string;
  details?: unknown;
}

export function DisapproveLeaveDialog({
  leave,
  open,
  onOpenChange,
}: DisapproveLeaveDialogProps) {
  console.log("leave front", leave);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [signature, setSignature] = useState("");
  const [comments, setComments] = useState("");

  const isSupervisor =
    session?.user?._id === leave?.supervisorId._id &&
    session?.user?.roles.includes("supervisor");

  const isAdmin = session?.user?.roles.some((role) =>
    ["sysAdmin", "administrator"].includes(role)
  );

  const isSupervisorReviewed =
    leave?.approvalFlow.supervisorApproval.status !== "pending";

  const canDisapprove =
    ((isSupervisor && isAdmin) ||
      (isSupervisor && !isSupervisorReviewed) ||
      (isAdmin && isSupervisorReviewed)) &&
    leave?.status === "pending";

  console.log("Approval checks:", {
    isSupervisor,
    isAdmin,
    isSupervisorReviewed,
    leaveStatus: leave?.status,
    approvalFlow: leave?.approvalFlow,
    canDisapprove,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Starting rejection request for leave:", leave?._id);

      const response = await apiClient(
        `/leaves/${leave?._id}/reject`,
        session,
        {
          method: "PUT",
          body: JSON.stringify({
            signature,
            comments,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("Rejection successful:", data);
      queryClient.invalidateQueries({ queryKey: ["leave", leave?._id] });
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Leave request rejected successfully");
      onOpenChange(false);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to reject leave");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { signature, comments });

    if (!signature) {
      toast.error("Please provide your signature");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Leave Request</DialogTitle>
        </DialogHeader>
        {isAdmin && isSupervisorReviewed ? (
          <p className="text-sm text-destructive">
            This leave request needs supervisor review first.
          </p>
        ) : !canDisapprove ? (
          <p className="text-sm text-muted-foreground">
            You dont have permission to reject this leave request.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Reason for Rejection (Required)</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Signature</Label>
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
              <Button
                type="submit"
                variant="destructive"
                disabled={mutation.isPending || !canDisapprove}
              >
                {mutation.isPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
