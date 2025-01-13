"use client";

import { useSession } from "next-auth/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface CustomRequestInit extends RequestInit {
    headers?: Record<string, string>;
}

export async function clientFetchApi(endpoint: string, options: CustomRequestInit = {}) {
    const { data: session } = useSession();

    if (!session?.user?.accessToken) {
        throw new Error('Authentication required');
    }

    const url = `${API_URL}${endpoint}`;
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
} 