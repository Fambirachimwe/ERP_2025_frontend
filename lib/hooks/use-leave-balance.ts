import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export function useLeaveBalance() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ["leave-balance"],
        queryFn: () => apiClient("/leaves/balance", session),
        enabled: !!session?.user,
    });
} 