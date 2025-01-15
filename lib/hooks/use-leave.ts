import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function useLeave(id: string) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { data: leave, isLoading, error } = useQuery({
        queryKey: ["leave", id],
        queryFn: () => apiClient(`/leaves/${id}`, session),
        retry: false,
    });

    const deleteMutation = useMutation({
        mutationFn: () =>
            apiClient(`/leaves/${id}`, session, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leaves"] });
            toast.success("Leave request deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete leave request");
        },
    });

    const notifyMutation = useMutation({
        mutationFn: () =>
            apiClient(`/leaves/${id}/notify`, session, {
                method: "POST",
            }),
        onSuccess: () => {
            toast.success("Supervisor notified successfully");
        },
        onError: () => {
            toast.error("Failed to notify supervisor");
        },
    });

    return {
        leave,
        isLoading,
        error,
        deleteLeave: deleteMutation.mutateAsync,
        notifySupervisor: notifyMutation.mutateAsync,
    };
} 