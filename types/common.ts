export interface ApiError {
    message: string;
    status?: number;
    details?: unknown;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface UserNavProps {
    user: {
        name?: string;
        email?: string;
        image?: string;
    };
}

export interface MonitoringData {
    dueForMonitoring: MonitoringRecord[];
    assetsByStatus: StatusCount[];
    assetsWithIssues: AssetIssue[];
    totalAssets: number;
}

export interface MonitoringRecord {
    _id: string;
    assetId: string;
    nextMonitoringDate: string;
    status: string;
}

export interface StatusCount {
    _id: string;
    count: number;
}

export interface AssetIssue {
    _id: string;
    assetId: string;
    issue: string;
    severity: string;
}

export interface ServiceHistoryFormData {
    serviceDate: Date;
    serviceProvider: string;
    serviceDetails: string;
    cost: number;
    nextServiceDue: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
} 