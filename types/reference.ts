export interface Reference {
    _id: string;
    referenceNumber: string;
    documentType: 'report' | 'letter';
    reportType?: 'general' | 'project';
    letterType?: 'general' | 'project';
    title: string;
    description?: string;
    documentUrl: string;
    department: string;
    projectNumber?: string;
    userInitials: string;
    createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
} 