import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { Leave } from "@/types/leave";

export function useLeaves() {
    const { data: session } = useSession();

    const allLeavesQuery = useQuery<Leave[]>({
        queryKey: ["leaves", "all"],
        queryFn: () => apiClient("/leaves", session),
        enabled: session?.user?.roles?.some(role =>
            ["sysAdmin", "administrator", "supervisor"].includes(role)
        ),
    });

    const userLeavesQuery = useQuery<Leave[]>({
        queryKey: ["leaves", "user"],
        queryFn: () => apiClient("/leaves/user", session),
    });

    return {
        data: allLeavesQuery.data || userLeavesQuery.data || [],
        userLeaves: userLeavesQuery.data || [],
        isLoading: allLeavesQuery.isLoading || userLeavesQuery.isLoading
    };
} 