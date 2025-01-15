import { toast } from "sonner";

interface ApiError {
    message?: string;
    status?: number;
    details?: unknown;
}

export function handleApiError(error: ApiError, fallbackMessage = "An error occurred") {
    const errorMessage = error.message || fallbackMessage;
    const errorDetails = error.details
        ? typeof error.details === 'string'
            ? error.details
            : JSON.stringify(error.details)
        : 'Please try again later';

    toast.error(errorMessage, {
        description: errorDetails,
        position: "top-right",
    });

    console.error("API Error:", {
        message: errorMessage,
        details: error.details,
        status: error.status
    });
} 