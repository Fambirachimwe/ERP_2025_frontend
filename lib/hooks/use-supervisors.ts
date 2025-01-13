import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/user";

export function useSupervisors() {
    const { data: session } = useSession();

    return useQuery<User[]>({
        queryKey: ["users", "supervisors"],
        queryFn: () => apiClient("/users/supervisors", session),
    });
} 