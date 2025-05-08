import { IUser } from './auth';

export interface IStatusLog {
  status: 'pending' | 'approved' | 'restricted' | 'suspended' | 'rejected';
  reason?: string;
  createdAt: Data | string;
}

export interface ISeller {
  _id: string;
  user: IUser;
  businessName: string;
  statusLogs: IStatusLog[];
  gstNumber: string;
  documents?: string[];
  commissionRate?: number;
  status: 'pending' | 'approved' | 'restricted' | 'suspended' | 'rejected';
  isApproved?: boolean;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  rejectionReason?: string;
  canRefill?: boolean;
  refilledAt?: Date;
}
