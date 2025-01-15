"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Leave } from "@/types/leave";

interface LeaveContextMenuProps {
  leave: Leave;
}

export function LeaveContextMenu({ leave }: LeaveContextMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const isSupervisor = session?.user?._id === leave.supervisorId._id;
  const isAdmin = session?.user?.roles?.some((role) =>
    ["administrator", "sysAdmin"].includes(role)
  );

  // Hide buttons if leave is already approved or rejected
  const isLeaveFinalized =
    leave.status === "approved" || leave.status === "rejected";

  // For supervisor: show buttons only if leave is pending
  const showSupervisorActions = isSupervisor && leave.status === "pending";

  // For admin: show buttons only if leave is supervisor_approved
  const showAdminActions = isAdmin && leave.status === "supervisor_approved";

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiClient(`/leaves/${leave._id}`, session, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Leave request deleted successfully");
    },
  });

  const notifyMutation = useMutation({
    mutationFn: () =>
      apiClient(`/leaves/${leave._id}/notify`, session, {
        method: "POST",
      }),
    onSuccess: () => {
      toast.success("Supervisor notified successfully");
    },
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete leave request");
    }
  };

  const handleNotify = async () => {
    try {
      await notifyMutation.mutateAsync();
    } catch (error) {
      console.error("Error notifying supervisor:", error);
      toast.error("Failed to notify supervisor");
    }
  };

  if (isLeaveFinalized) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/leaves/${leave._id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/leaves/${leave._id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        {showSupervisorActions && (
          <>
            <DropdownMenuItem onClick={() => handleApprove(leave)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReject(leave)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </>
        )}

        {showAdminActions && (
          <>
            <DropdownMenuItem onClick={() => handleApprove(leave)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReject(leave)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </>
        )}

        {leave.status === "pending" && (
          <DropdownMenuItem onClick={handleNotify}>
            <Bell className="mr-2 h-4 w-4" />
            Notify Supervisor
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
