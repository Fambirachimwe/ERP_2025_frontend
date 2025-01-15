"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Reference } from "@/types/reference";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Upload,
  Loader2,
  Download,
  MoreHorizontal,
  Eye,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ReferencesTableProps {
  references: Reference[];
}

export function ReferencesTable({ references }: ReferencesTableProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  console.log(references);

  const deleteMutation = useMutation({
    mutationFn: async (referenceId: string) =>
      apiClient(`/references/${referenceId}`, session, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      toast.success("Reference deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete reference");
      console.error("Delete error:", error);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (url: string) => {
      // Use the backend URL for downloads
      const downloadUrl = url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${url}`;

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      return { blob, filename: url.split("/").pop() || "document" };
    },
    onSuccess: ({ blob, filename }) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast("Download successfull ");
    },
    onError: () => {
      toast.error("Failed to download file");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      referenceId,
      file,
    }: {
      referenceId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/references/${referenceId}/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (!data.documentUrl) {
        throw new Error("No document URL received");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      toast.success("Document uploaded successfully", {
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload document", {
        position: "top-right",
      });
    },
    onSettled: () => {
      setUploadingId(null);
    },
  });

  const handleFileUpload = async (referenceId: string, file: File) => {
    setUploadingId(referenceId);
    try {
      await uploadMutation.mutateAsync({ referenceId, file });
    } catch {
      // Error is handled in mutation callbacks
    }
  };

  const handleDelete = async (referenceId: string) => {
    try {
      await deleteMutation.mutateAsync(referenceId);
    } catch (error) {
      console.log(error);
      // Error is handled in mutation callbacks
    }
  };

  const reports = references.filter((ref) => ref.documentType === "report");
  const letters = references.filter((ref) => ref.documentType === "letter");

  const ReferenceTable = ({ items }: { items: Reference[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Project Number</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((reference) => (
            <TableRow key={reference._id}>
              <TableCell className="font-medium">
                {reference.referenceNumber}
              </TableCell>
              <TableCell>{reference.title}</TableCell>
              <TableCell>{reference.department}</TableCell>
              <TableCell>{reference.projectNumber || "N/A"}</TableCell>
              <TableCell>
                {reference.createdBy.firstName} {reference.createdBy.lastName}
              </TableCell>
              <TableCell>
                {format(new Date(reference.createdAt), "PPP")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={reference.documentUrl ? "success" : "secondary"}
                  className="whitespace-nowrap"
                >
                  {reference.documentUrl ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2 inline-block" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-gray-400 mr-2 inline-block" />
                      Pending Upload
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/references/${reference._id}`)
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        document
                          .getElementById(`file-${reference._id}`)
                          ?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingId === reference._id
                        ? "Uploading..."
                        : reference.documentUrl
                        ? "Update File"
                        : "Upload File"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        downloadMutation.mutate(reference.documentUrl)
                      }
                      disabled={
                        !reference.documentUrl || downloadMutation.isPending
                      }
                      className={
                        !reference.documentUrl ? "text-muted-foreground" : ""
                      }
                    >
                      {downloadMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      {downloadMutation.isPending
                        ? "Downloading..."
                        : "Download"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(reference._id)}
                      disabled={
                        !reference.documentUrl || deleteMutation.isPending
                      }
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  type="file"
                  id={`file-${reference._id}`}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(reference._id, file);
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Tabs defaultValue="reports" className="space-y-4">
      <TabsList>
        <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
        <TabsTrigger value="letters">Letters ({letters.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="reports">
        <ReferenceTable items={reports} />
      </TabsContent>
      <TabsContent value="letters">
        <ReferenceTable items={letters} />
      </TabsContent>
    </Tabs>
  );
}
