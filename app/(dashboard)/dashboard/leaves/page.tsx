"use client";

import { useLeaves } from "@/lib/hooks/use-leaves";
import { LeavesTabs } from "@/components/dashboard/leaves/leaves-tabs";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateLeaveDialog } from "@/components/dashboard/leaves/create-leave-dialog";

export default function LeavesPage() {
  const { data: leaves, userLeaves, isLoading } = useLeaves();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  console.log("leaves from the leaves page", leaves);

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Leave Requests</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </Button>
      </div>
      <LeavesTabs leaves={leaves} userLeaves={userLeaves} />
      <CreateLeaveDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
