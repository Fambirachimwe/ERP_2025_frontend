import { Session } from "next-auth";
import { handleApiError } from "@/lib/utils/handle-error";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiClient(endpoint: string, session: Session | null, options: RequestInit = {}) {
    if (!session?.user?.accessToken) {
        throw new Error('Authentication required');
    }

    try {
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
            throw {
                status: response.status,
                message: data.message || 'An error occurred',
                details: data.error || data
            };
        }

        return data;
    } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';
        const errorDetails = error.details || error;
        throw { message: errorMessage, details: errorDetails };
    }
} 