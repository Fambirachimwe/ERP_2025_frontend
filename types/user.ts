export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    department: string;
    roles: string[];
    isActive: boolean;
    lastLogin?: Date;
} 