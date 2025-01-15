"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UploadAssetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadAssetsDialog({
  open,
  onOpenChange,
}: UploadAssetsDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient("/assets/upload", session, {
        method: "POST",
        body: formData,
        headers: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Assets uploaded successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to upload assets");
      console.error("Upload error:", error);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await mutation.mutateAsync(file);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Assets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Upload a CSV or Excel file containing asset data
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
