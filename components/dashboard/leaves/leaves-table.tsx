"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Leave {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    department: string;
  } | null;
  startDate: string;
  endDate: string;
  absenceType: string;
  status: string;
  daysRequested: number;
}

interface LeavesTableProps {
  leaves: Leave[];
  showApprovalActions?: boolean;
}

export function LeavesTable({ leaves }: LeavesTableProps) {
  const router = useRouter();

  // console.log("from the leaves table", leaves);

  const handleRowClick = (leaveId: string) => {
    router.push(`/dashboard/leaves/${leaveId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow
              key={leave._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(leave._id)}
            >
              <TableCell>
                {leave.employeeId ? (
                  <>
                    {leave.employeeId.firstName} {leave.employeeId.lastName}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {leave.employeeId.department}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Employee not found
                  </span>
                )}
              </TableCell>
              <TableCell className="capitalize">{leave.absenceType}</TableCell>
              <TableCell>
                {format(new Date(leave.startDate), "PPP")} -{" "}
                {format(new Date(leave.endDate), "PPP")}
              </TableCell>
              <TableCell>{leave.daysRequested} days</TableCell>
              <TableCell>
                <Badge
                  variant={
                    leave.status === "approved"
                      ? "default"
                      : leave.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {leave.status.replace("_", " ").toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
