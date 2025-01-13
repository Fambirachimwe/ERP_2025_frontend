export interface Asset {
    _id: string;
    model: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyExpiry: string;
    status: 'active' | 'inactive' | 'maintenance' | 'disposed';
    type: 'laptop' | 'desktop' | 'vehicle' | 'other';
    assignedTo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    licensePlateNumber?: string;
    chassisNumber?: string;
    specifications?: Record<string, string>;
    notes?: string;
    createdAt: string;
    updatedAt: string;
} 