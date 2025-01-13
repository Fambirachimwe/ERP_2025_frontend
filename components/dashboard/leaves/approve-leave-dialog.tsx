"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Leave } from "@/types/leave";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePadComponent } from "@/components/dashboard/leaves/signature-pad";

interface ApproveLeaveDialogProps {
  leave: Leave;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproveLeaveDialog({
  leave,
  open,
  onOpenChange,
}: ApproveLeaveDialogProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [signature, setSignature] = useState<string>("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = session?.user?.roles?.some((role) =>
    ["sysAdmin", "administrator"].includes(role)
  );
  const isSupervisor = session?.user?.id === leave?.supervisorId._id;

  const handleApprove = async () => {
    if (!signature) return;

    setIsSubmitting(true);
    try {
      await apiClient(`/leaves/${leave._id}/approve`, session, {
        method: "PUT",
        body: JSON.stringify({ signature, comments }),
      });

      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leave", leave._id] });
      queryClient.invalidateQueries({ queryKey: ["leaveBalance"] });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Error approving leave:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogTitle = () => {
    if (isAdmin && leave.status === "supervisor_approved") {
      return "Final Approval";
    }
    return "Approve Leave Request";
  };

  const getDialogMessage = () => {
    if (isAdmin && leave.status === "supervisor_approved") {
      return "You are about to give final approval for this leave request. This action cannot be undone.";
    }
    return "You are about to approve this leave request. The request will then be sent for final approval.";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">{getDialogMessage()}</p>
          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments (optional)"
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={!signature || isSubmitting}>
            {isSubmitting ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
