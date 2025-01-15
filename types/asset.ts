export interface Asset {
    _id: string;
    assetId: string;
    model: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyExpiry: string;
    status: 'active' | 'inactive' | 'maintenance' | 'disposed';
    type: 'laptop' | 'desktop' | 'vehicle' | 'other' | 'software' | 'furniture';
    assignedTo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    manufacturer?: string;
    version?: string;
    licenseKey?: string;
    expirationDate?: string;
    licensePlateNumber?: string;
    chassisNumber?: string;
    specifications?: Record<string, string>;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    location?: string;
    department?: string;
    vehicleDetails?: {
        licensePlateNumber: string;
        chassisNumber: string;
    };
    serviceHistory?: AssetHistory[];
}

export interface AssetHistory {
    _id: string;
    action: "assigned" | "unassigned";
    assignedTo: {
        firstName: string;
        lastName: string;
        email: string;
    };
    serviceDate?: string;
    serviceProvider?: string;
    serviceDetails?: string;
    cost?: number;
    nextServiceDue?: string;
    date?: string;
    note?: string;
    type?: string;
} 