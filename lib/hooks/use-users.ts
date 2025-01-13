"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";

export function useUsers() {
    const { data: session, status } = useSession();

    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => apiClient("/users", session),
        enabled: status === "authenticated",
    });
} 