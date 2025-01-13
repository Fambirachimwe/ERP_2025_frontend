"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Leave } from "@/types/leave";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { ApproveLeaveDialog } from "@/components/dashboard/leaves/approve-leave-dialog";
import { DisapproveLeaveDialog } from "@/components/dashboard/leaves/disapprove-leave-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

export default function LeavePage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDisapproveDialogOpen, setIsDisapproveDialogOpen] = useState(false);

  const { data: leave, isLoading } = useQuery<Leave>({
    queryKey: ["leave", params.id],
    queryFn: () => apiClient(`/leaves/${params.id}`, session),
    enabled: !!session && !!params.id,
  });

  if (isLoading || !leave) {
    return <LeaveDetailSkeleton />;
  }

  const isSupervisor = session?.user?._id === leave.supervisorId._id;
  const isAdmin = session?.user?.roles?.some((role: string) =>
    ["administrator", "sysAdmin", "admin"].includes(role.toLowerCase())
  );

  console.log("User roles:", session?.user?.roles);
  console.log("Leave status:", leave.status);
  console.log("Is Admin:", isAdmin);
  console.log("Is Supervisor:", isSupervisor);

  const canApprove =
    (isAdmin || isSupervisor) &&
    ((isAdmin && leave.approvalFlow.supervisorApproval.status === "approved") ||
      (isSupervisor && leave.status === "pending"));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Leave Details</h2>
        </div>
        <Badge>{leave.status}</Badge>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">Name</p>
              <p className="text-sm text-muted-foreground">
                {leave.employeeId.firstName} {leave.employeeId.lastName}
              </p>
            </div>
            <div>
              <p className="font-medium">Department</p>
              <p className="text-sm text-muted-foreground">
                {leave.employeeId.department}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">Type</p>
              <p className="text-sm text-muted-foreground">{leave.type}</p>
            </div>
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(leave.startDate), "PPP")} -{" "}
                {format(new Date(leave.endDate), "PPP")}
              </p>
            </div>
            <div>
              <p className="font-medium">Reason</p>
              <p className="text-sm text-muted-foreground">{leave.reason}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline>
            <TimelineItem
              title="Supervisor Approval"
              status={leave.approvalFlow.supervisorApproval.status}
              date={leave.approvalFlow.supervisorApproval.signatureDate}
              icon={
                leave.approvalFlow.supervisorApproval.status === "approved" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : leave.approvalFlow.supervisorApproval.status ===
                  "rejected" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )
              }
              comments={leave.approvalFlow.supervisorApproval.comments}
            />
            <TimelineItem
              title="Admin Approval"
              status={leave.approvalFlow.adminApproval.status}
              date={leave.approvalFlow.adminApproval.signatureDate}
              icon={
                leave.approvalFlow.adminApproval.status === "approved" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : leave.approvalFlow.adminApproval.status === "rejected" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )
              }
              comments={leave.approvalFlow.adminApproval.comments}
            />
          </Timeline>
        </CardContent>
      </Card>

      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Button
              onClick={() => setIsApproveDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAdmin ? "Admin Approve" : "Supervisor Approve"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDisapproveDialogOpen(true)}
            >
              {isAdmin ? "Admin Reject" : "Supervisor Reject"}
            </Button>
          </CardContent>
        </Card>
      )}

      <ApproveLeaveDialog
        leave={leave}
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      />

      <DisapproveLeaveDialog
        leave={leave}
        open={isDisapproveDialogOpen}
        onOpenChange={setIsDisapproveDialogOpen}
      />
    </div>
  );
}

function LeaveDetailSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
