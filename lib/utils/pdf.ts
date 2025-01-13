export function getPublicFileUrl(path: string) {
    // If it's a base64 image, return it directly
    if (path.startsWith('data:image')) {
        return path;
    }

    // For regular URLs
    if (process.env.NODE_ENV === 'development') {
        return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${path}`;
    }

    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
} 