"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { useState } from "react";
import { AddReferenceDialog } from "@/components/dashboard/references/add-reference-dialog";
import { ReferencesTable } from "@/components/dashboard/references/references-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReferencesPage() {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: references, isLoading } = useQuery({
    queryKey: ["references"],
    queryFn: () => apiClient("/references", session),
  });

  if (isLoading) return <ReferencesPageSkeleton />;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">References</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reference
          </Button>
        </div>
      </div>

      <ReferencesTable references={references || []} />

      <AddReferenceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}

function ReferencesPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
