export interface Leave {
    _id: string;
    employeeId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
    };
    supervisorId?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    absenceType: 'Sick' | 'Vacation/Personal' | 'Study' | 'Maternity/Paternity' | 'Compassionate' | 'Special';
    startDate: string;
    endDate: string;
    daysRequested: number;
    reason: string;
    status: 'pending' | 'supervisor_approved' | 'approved' | 'rejected';
    employeeSignature: string;
    employeeSignatureDate: string;
    approvalFlow: {
        supervisorApproval: {
            status: 'pending' | 'approved' | 'rejected';
            signature?: string;
            signatureDate?: string;
            comments?: string;
        };
        adminApproval: {
            status: 'pending' | 'approved' | 'rejected';
            signature?: string;
            signatureDate?: string;
            comments?: string;
        };
    };
    createdAt: string;
    updatedAt: string;
} 