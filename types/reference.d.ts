export interface Reference {
    _id: string;
    referenceNumber: string;
    title: string;
    description?: string;
    documentUrl: string;
    department: string;
    projectNumber?: string;
    createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
} 