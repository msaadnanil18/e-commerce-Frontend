import { IUser } from './auth';
export interface ISeller {
  _id: string;
  user: IUser;
  businessName: string;
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
