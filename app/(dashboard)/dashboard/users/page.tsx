"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { UsersTable } from "@/components/dashboard/users/users-table";
import { AddUserDialog } from "@/components/dashboard/users/add-user-dialog";
import { UploadUsersDialog } from "@/components/dashboard/users/upload-users-dialog";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { User } from "@/types/user";

export default function UsersPage() {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => apiClient("/users", session),
    enabled: !!session,
  });

  if (isLoading) return <DataTableSkeleton />;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Users
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <UsersTable users={users} />

      <AddUserDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <UploadUsersDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}
