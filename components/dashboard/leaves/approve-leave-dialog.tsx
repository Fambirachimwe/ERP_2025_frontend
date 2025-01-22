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

  const isSupervisor = session?.user?.id === leave?.supervisorId._id;
  const isAdmin = session?.user?.roles?.some((role) =>
    ["administrator", "sysAdmin"].includes(role)
  );

  // Determine approval type
  let approvalType = "";
  if (isSupervisor && leave?.status === "pending") {
    approvalType = "supervisor";
  } else if (isAdmin && leave?.status === "supervisor_approved") {
    approvalType = "admin";
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!leave) return;

      const approvalData = {
        status: "approved",
        comments,
        signature,
        approvalType,
      };

      return await apiClient(`/leaves/${leave._id}/approve`, session, {
        method: "POST",
        body: JSON.stringify(approvalData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leave", leave?._id] });
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

  // Only render if user has permission to approve
  if (!approvalType) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Leave Request</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!signature) {
              toast.error("Please provide your signature");
              return;
            }
            mutation.mutate();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments..."
              />
            </div>
            <div className="space-y-2">
              <Label>Signature</Label>
              <SignaturePadComponent
                onSave={setSignature}
                existingSignature={signature}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
