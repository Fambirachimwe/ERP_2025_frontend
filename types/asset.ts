export interface Asset {
    _id: string;
    assetId: string;
    type: 'laptop' | 'monitor' | 'cpu' | 'mouse' | 'hardDrive' | 'vehicle' | 'furniture' | 'software';
    model: string;
    manufacturer: string;
    serialNumber: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    price?: number;
    location: string;
    department: string;
    status: 'available' | 'in_use' | 'maintenance' | 'missing' | 'disposed';
    assignedTo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    // Software specific fields
    licenseKey?: string;
    version?: string;
    expirationDate?: string;
    // Vehicle specific fields
    vehicleDetails?: {
        licensePlateNumber: string;
        chassisNumber: string;
    };
    // Service history
    serviceHistory?: AssetHistory[];
    // Tracking
    tracking?: {
        lastScannedBy?: string;
        lastScannedAt?: string;
        location?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface AssetHistory {
    _id: string;
    action: "assigned" | "unassigned" | "service";
    date: string;
    assignedTo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    serviceDetails?: {
        serviceProvider: string;
        serviceType: string;
        description: string;
        cost: number;
        nextServiceDue: string;
        status: 'scheduled' | 'completed' | 'cancelled';
    };
    note?: string;
}

export interface AssetFormValues {
    model: string;
    manufacturer: string;
    serialNumber: string;
    location: string;
    department: string;
    status: string;
    price?: number;
    purchaseDate?: string;
    warrantyExpiry?: string;
    licenseKey?: string;
    version?: string;
    expirationDate?: string;
    vehicleDetails?: {
        licensePlateNumber: string;
        chassisNumber: string;
    };
} 