"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import {
  ArrowLeft,
  Loader2,
  Download,
  CheckCircle,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import { useLeave } from "@/lib/hooks/use-leave";
import { useState } from "react";
import { ApproveLeaveDialog } from "@/components/dashboard/leaves/approve-leave-dialog";
import { DisapproveLeaveDialog } from "@/components/dashboard/leaves/disapprove-leave-dialog";

export default function LeaveDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { leave, isLoading: isLeaveLoading, error } = useLeave(id as string);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDisapproveDialogOpen, setIsDisapproveDialogOpen] = useState(false);
  const { data: session } = useSession();

  if (isLeaveLoading) return <LeaveDetailSkeleton />;

  if (error) {
    toast.error("Failed to load leave details");
    router.push("/dashboard/leaves");
    return null;
  }

  if (!leave) return <div>Leave not found</div>;
  // console.log("leave", leave);

  const isSupervisor = session?.user?._id === leave?.supervisorId._id;
  const isAdmin = session?.user?.roles.some((role) =>
    ["sysAdmin", "administrator"].includes(role)
  );
  const canApprove = (isSupervisor || isAdmin) && leave.status === "pending";
  console.log({
    userRoles: session?.user?.roles,
    userId: session?.user?._id,
    supervisorId: leave?.supervisorId._id,
    isSupervisor,
    isAdmin,
    canApprove,
    leaveStatus: leave.status,
  });

  const getTimelineItems = () => [
    {
      title: "Leave Request Submitted",
      description: `By ${leave.employeeId.firstName} ${leave.employeeId.lastName}`,
      status: "complete" as const,
      date: format(new Date(leave.createdAt), "PPP p"),
      icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
    },
    {
      title: "Supervisor Approval",
      description:
        leave.approvalFlow.supervisorApproval.status === "pending"
          ? "Awaiting supervisor approval"
          : `${
              leave.approvalFlow.supervisorApproval.status === "approved"
                ? "Approved"
                : "Rejected"
            } by ${leave.supervisorId.firstName} ${
              leave.supervisorId.lastName
            }`,
      status:
        leave.approvalFlow.supervisorApproval.status === "pending"
          ? "current"
          : ("complete" as const),
      date: leave.approvalFlow.supervisorApproval.signatureDate
        ? format(
            new Date(leave.approvalFlow.supervisorApproval.signatureDate),
            "PPP p"
          )
        : undefined,
      icon:
        leave.approvalFlow.supervisorApproval.status === "pending" ? (
          <Clock className="h-4 w-4 text-muted-foreground" />
        ) : leave.approvalFlow.supervisorApproval.status === "approved" ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive" />
        ),
    },
    {
      title: "Admin Approval",
      description:
        leave.approvalFlow.adminApproval?.status === "pending"
          ? "Awaiting admin approval"
          : `${
              leave.approvalFlow.adminApproval?.status === "approved"
                ? "Approved"
                : "Rejected"
            }${
              leave.approvalFlow.adminApproval?.comments
                ? ` - ${leave.approvalFlow.adminApproval?.comments}`
                : ""
            }`,
      status:
        leave.approvalFlow.supervisorApproval?.status !== "approved"
          ? "upcoming"
          : leave.approvalFlow.adminApproval?.status === "pending"
          ? "current"
          : ("complete" as const),
      date: leave.approvalFlow.adminApproval?.signatureDate
        ? format(
            new Date(leave.approvalFlow.adminApproval?.signatureDate),
            "PPP p"
          )
        : undefined,
      icon:
        leave.approvalFlow.adminApproval?.status === "pending" ? (
          <Clock className="h-4 w-4 text-muted-foreground" />
        ) : leave.approvalFlow.adminApproval?.status === "approved" ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : leave.approvalFlow.adminApproval?.status === "rejected" ? (
          <XCircle className="h-4 w-4 text-destructive" />
        ) : null,
    },
  ];

  const showActions =
    leave?.status !== "rejected" &&
    leave?.status !== "approved" &&
    // Show for supervisors if pending
    ((isSupervisor && leave?.status === "pending") ||
      // Show for admins if supervisor approved
      (isAdmin && leave?.status === "supervisor_approved"));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Leave Details</h2>
        </div>
        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDisapproveDialogOpen(true)}
              className="flex items-center text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => setIsApproveDialogOpen(true)}
              className="flex items-center"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leave Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-sm font-medium">Employee</div>
              <div className="text-sm">
                {leave?.employeeId.firstName} {leave?.employeeId.lastName}
              </div>

              <div className="text-sm font-medium">Department</div>
              <div className="text-sm">{leave?.employeeId.department}</div>

              <div className="text-sm font-medium">Supervisor</div>
              <div className="text-sm">
                {leave?.supervisorId.firstName} {leave?.supervisorId.lastName}
              </div>

              <div className="text-sm font-medium">Type</div>
              <div className="text-sm">{leave?.absenceType}</div>

              <div className="text-sm font-medium">Duration</div>
              <div className="text-sm">
                {format(new Date(leave?.startDate!), "PPP")} -{" "}
                {format(new Date(leave?.endDate!), "PPP")}
              </div>

              <div className="text-sm font-medium">Days Requested</div>
              <div className="text-sm">{leave?.daysRequested} days</div>

              <div className="text-sm font-medium">Status</div>
              <div className="text-sm">
                <Badge
                  variant={
                    leave?.status === "approved"
                      ? "default"
                      : leave?.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {leave?.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-sm font-medium">Reason</div>
              <div className="text-sm text-muted-foreground mt-1">
                {leave?.reason}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <Image
                src={leave.employeeSignature}
                alt="Employee Signature"
                width={400}
                height={200}
                className="w-full object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Signed on {format(new Date(leave.employeeSignatureDate), "PPP p")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline items={getTimelineItems() as any} />
        </CardContent>
      </Card>

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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
