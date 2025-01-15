export interface Reference {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    uploadedBy: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    createdAt: string;
    updatedAt: string;
} 