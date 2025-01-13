"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeavesTable } from "./leaves-table";
import { Leave } from "@/types/leave";
import { useSession } from "next-auth/react";

interface LeavesTabsProps {
  leaves: Leave[];
  userLeaves: Leave[];
}

export function LeavesTabs({ leaves, userLeaves }: LeavesTabsProps) {
  const { data: session } = useSession();

  const isAdmin = session?.user?.roles.some((role) =>
    ["sysAdmin", "administrator"].includes(role)
  );
  const isSupervisor = session?.user?.roles.includes("supervisor");

  // Filter leaves that need the current user's approval
  const pendingApproval = leaves.filter((leave) => {
    const currentUserId = session?.user?._id;
    if (!currentUserId) return false;

    // For supervisors: show leaves where they are the supervisor and status is pending
    if (isSupervisor && leave?.supervisorId === currentUserId) {
      return (
        leave.status === "pending" &&
        leave.approvalFlow.supervisorApproval.status === "pending"
      );
    }

    // For admins: show leaves that have supervisor approval but need admin approval
    if (isAdmin) {
      return (
        leave.approvalFlow.supervisorApproval.status === "approved" &&
        leave.approvalFlow.adminApproval.status === "pending"
      );
    }

    return false;
  });
  console.log("pendingApproval", pendingApproval);

  return (
    <Tabs defaultValue={isAdmin ? "all" : "my-leaves"} className="space-y-4">
      <TabsList>
        {isAdmin && <TabsTrigger value="all">All Leaves</TabsTrigger>}
        <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
        {(isSupervisor || isAdmin) && (
          <TabsTrigger value="pending-approval" className="relative">
            Pending Approval
            {pendingApproval.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {pendingApproval.length}
              </span>
            )}
          </TabsTrigger>
        )}
      </TabsList>

      {isAdmin && (
        <TabsContent value="all" className="space-y-4">
          <LeavesTable leaves={leaves} />
        </TabsContent>
      )}

      <TabsContent value="my-leaves" className="space-y-4">
        <LeavesTable leaves={userLeaves} />
      </TabsContent>

      {(isSupervisor || isAdmin) && (
        <TabsContent value="pending-approval" className="space-y-4">
          <div className="mb-4 rounded-lg border border-muted bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Leaves that need administrator approval"
                : "Leaves that need your approval as a supervisor"}
            </p>
          </div>
          <LeavesTable leaves={pendingApproval} showApprovalActions={true} />
        </TabsContent>
      )}
    </Tabs>
  );
}
