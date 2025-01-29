export enum AssetType {
    Laptop = 'laptop',
    Monitor = 'monitor',
    CPU = 'cpu',
    Mouse = 'mouse',
    HardDrive = 'hardDrive',
    Vehicle = 'vehicle',
    Furniture = 'furniture',
    Software = 'software',
    Printer = 'printer',
    Other = 'other',
    Phone = 'phone',
    Tablet = 'tablet',
    Camera = 'camera',
    Keyboard = 'keyboard',
    Mousepad = 'mousepad',
    Webcam = 'webcam',
    Microphone = 'microphone',
    Speaker = 'speaker',
    Headset = 'headset'
}

export interface Asset {
    _id: string;
    assetId: string;
    type: string;
    assetType?: string;
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
    serviceHistory?: ServiceHistory[];
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
    asset: string;
    assignedTo: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    action: 'assigned' | 'unassigned';
    actionBy: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    date: string;
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

export interface ServiceHistory {
    _id: string;
    serviceDate: string;
    serviceProvider: string;
    serviceDetails: string;
    cost: number;
    nextServiceDue: string;
    status: 'scheduled' | 'completed' | 'cancelled';
}

export interface AssetStats {
    total: number;
    totalAssets: number;
    softwareAssets: number;
    active: number;
    maintenance: number;
    disposed: number;
    byType: {
        [key: string]: number;
    };
} 