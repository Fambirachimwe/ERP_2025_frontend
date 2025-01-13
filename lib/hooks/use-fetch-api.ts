"use client";

import { useSession } from "next-auth/react";

export function useFetchApi() {
    const { data: session } = useSession();

    const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
        if (!session?.user?.accessToken) {
            throw new Error('Authentication required');
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    };

    return { fetchApi };
} 