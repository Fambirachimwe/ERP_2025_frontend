import { Session } from "next-auth";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiError {
    message: string;
    details?: unknown;
    status?: number;
}

export async function apiClient<T>(
    endpoint: string,
    session: Session | null,
    options: RequestInit = {}
): Promise<T> {
    if (!session?.user?.accessToken) {
        throw new Error('Authentication required');
    }

    // console.log(session);

    try {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.user.accessToken}`,
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
            cache: 'no-store',
        });

        const data = await response.json();
        // console.log(data);

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'An error occurred',
                details: data.error || data
            };
        }

        return data;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'An unexpected error occurred';
        const errorDetails = apiError.details || error;
        throw { message: errorMessage, details: errorDetails };
    }
} 