export interface Activity {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        department: string;
    };
    action: string;
    module: string;
    description: string;
    timestamp: string;
} 