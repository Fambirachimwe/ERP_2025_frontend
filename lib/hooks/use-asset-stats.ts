"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { AssetStats } from "@/types/asset";

export function useAssetStats() {
    const { data: session } = useSession();

    return useQuery<AssetStats>({
        queryKey: ["assets", "stats"],
        queryFn: () => apiClient("/assets/stats", session),
        enabled: !!session?.user,
    });
} 