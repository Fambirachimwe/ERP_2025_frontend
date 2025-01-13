"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Pencil, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Reference } from "@/types/reference";
import { useState } from "react";
import { EditReferenceDialog } from "@/components/dashboard/references/edit-reference-dialog";
import { toast } from "sonner";

export default function ReferenceDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: reference, isLoading } = useQuery<Reference>({
    queryKey: ["reference", id],
    queryFn: () => apiClient(`/references/${id}`, session),
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reference?")) return;

    try {
      await apiClient(`/references/${id}`, session, {
        method: "DELETE",
      });
      toast.success("Reference deleted successfully");
      router.push("/dashboard/references");
    } catch (error) {
      toast.error("Failed to delete reference");
    }
  };

  if (isLoading) return <ReferenceDetailSkeleton />;
  if (!reference) return <div>Reference not found</div>;

  const isAdmin = session?.user?.roles?.some(
    (role) => role === "sysAdmin" || role === "administrator"
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/references")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to References
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Reference Details
          </h2>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Reference Number:</span>
              <span>{reference.referenceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Title:</span>
              <span>{reference.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Department:</span>
              <span>{reference.department}</span>
            </div>
            {reference.projectNumber && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Project Number:</span>
                <span>{reference.projectNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Created By:</span>
              <span>
                {reference.createdBy.firstName} {reference.createdBy.lastName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Created:</span>
              <span>
                {formatDistanceToNow(new Date(reference.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Document:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(reference.documentUrl, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Document
              </Button>
            </div>
          </CardContent>
        </Card>

        {reference.description && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {reference.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <EditReferenceDialog
        reference={reference}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}

function ReferenceDetailSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
