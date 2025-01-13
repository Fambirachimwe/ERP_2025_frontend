export interface Asset {
    _id: string;
    assetId: string;
    type: 'laptop' | 'monitor' | 'cpu' | 'mouse' | 'hardDrive' | 'vehicle' | 'furniture' | 'software';
    model: string;
    serialNumber: string;
    department: string;
    manufacturer: string;
    version?: string;
    licenseKey?: string;
    expirationDate?: string;
    status: 'active' | 'inactive' | 'disposed';
    location?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    nextServiceDue?: string;
    serviceHistory?: Array<{
        _id: string;
        serviceDate: string;
        serviceProvider: string;
        serviceDetails: string;
        cost: number;
        nextServiceDue: string;
    }>;
    assignedTo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
    vehicleDetails?: {
        licensePlate: string;
        chassisNumber: string;
    };
}

export interface AssetStats {
    totalAssets: number;
    activeAssets: number;
    softwareAssets: number;
    hardwareAssets: number;
    maintenanceDue: number;
}

export interface AssetHistory {
    _id: string;
    date: string;
    type: 'assigned' | 'unassigned';
    assignedTo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface ServiceHistory {
    serviceDate: string;
    serviceProvider: string;
    serviceDetails: string;
    cost: number;
    nextServiceDue: string;
} 