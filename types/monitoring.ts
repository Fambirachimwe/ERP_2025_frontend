export interface DashboardData {
    dueForMonitoring: MonitoringRecord[];
    assetsByStatus: StatusCount[];
    assetsWithIssues: AssetIssue[];
    totalAssets: number;
    activeMonitoring: number;
    pendingService: number;
    issuesReported: number;
}

export interface MonitoringRecord {
    _id: string;
    assetId: {
        _id: string;
        assetId: string;
        type: string;
        model: string;
        manufacturer: string;
        status: string;
        location: string;
    };
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

export interface MonitoredAsset extends MonitoringRecord {
    condition: string;
    monitoredAt: string;
    monitoredBy: {
        _id: string;
        firstName: string;
        lastName: string;
    };
} 