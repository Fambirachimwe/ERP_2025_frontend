"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { Activity } from "@/types/activity";

export function useActivities() {
    const { data: session, status } = useSession();

    return useQuery<Activity[]>({
        queryKey: ["activities"],
        queryFn: () => apiClient("/activities/recent", session),
        enabled: status === "authenticated",
    });
} 