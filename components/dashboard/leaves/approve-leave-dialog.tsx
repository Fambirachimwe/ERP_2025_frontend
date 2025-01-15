"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { Leave } from "@/types/leave";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SignaturePadComponent } from "./signature-pad";
import { toast } from "sonner";

interface ApproveLeaveDialogProps {
  leave: Leave | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproveLeaveDialog({
  leave,
  open,
  onOpenChange,
}: ApproveLeaveDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [comments, setComments] = useState("");
  const [signature, setSignature] = useState<string>("");

  const isSupervisor = session?.user?._id === leave?.supervisorId._id;
  const isAdmin = session?.user?.roles?.some((role) =>
    ["administrator", "sysAdmin"].includes(role)
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!leave) return;

      const approvalData = {
        status: "approved",
        comments,
        signature,
        approvalType: isSupervisor ? "supervisor" : "admin",
      };

      return await apiClient(`/leaves/${leave._id}/status`, session, {
        method: "POST",
        body: JSON.stringify(approvalData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      onOpenChange(false);
      setComments("");
      setSignature("");
      toast.success(
        isSupervisor
          ? "Leave request approved and forwarded to admin"
          : "Leave request approved"
      );
    },
    onError: () => {
      toast.error("Failed to approve leave request");
    },
  });

  // Check if admin can approve (supervisor must have approved first)
  // const canAdminApprove = isAdmin && leave?.status === "supervisor_approved";

  // Prevent admin from approving if supervisor hasn't approved yet
  if (isAdmin && leave?.status !== "supervisor_approved") {
    return null;
  }

  const handleApprove = () => {
    if (!comments || !signature) {
      toast.error("Please provide both comments and signature");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSupervisor ? "Supervisor Approval" : "Admin Approval"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your comments (required)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Signature</Label>
            <SignaturePadComponent onSignatureComplete={setSignature} />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={!comments || !signature || mutation.isPending}
          >
            {mutation.isPending ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
