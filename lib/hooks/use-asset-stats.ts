"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { AssetStats } from "@/types/asset";

export function useAssetStats() {
    const { data: session } = useSession();

    console.log(session);

    return useQuery<AssetStats>({
        queryKey: ["assets", "stats"],
        queryFn: () => apiClient("/assets/stats", session),
        enabled: !!session?.user,
    });
} 