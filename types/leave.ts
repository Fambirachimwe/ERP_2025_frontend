export interface Leave {
    _id: string;
    employeeId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
    };
    supervisorId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    startDate: string;
    endDate: string;
    type: string;
    reason: string;
    status: string;
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
    absenceType: 'Sick' | 'Vacation/Personal' | 'Study' | 'Maternity/Paternity' | 'Compassionate' | 'Special';
    daysRequested: number;
    employeeSignature?: string;
    employeeSignatureDate?: string;
} 