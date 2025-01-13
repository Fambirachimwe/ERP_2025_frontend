import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { Asset } from "@/types/asset";

export function useAssignedAssets() {
    const { data: session } = useSession();

    return useQuery<Asset[]>({
        queryKey: ["assets", "assigned"],
        queryFn: () => apiClient("/assets/assigned", session),
        enabled: !!session?.user,
    });
} 