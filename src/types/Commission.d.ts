import { IUser } from './auth';

export interface ITier {
  minAmount: number;
  maxAmount?: number;
  commissionValue: number;
  commissionType: 'percentage' | 'fixed';
}

export interface ICommissionConfigForm {
  category: string;
  commissionType: 'percentage' | 'fixed' | 'tiered';
  value?: number;
  tiers?: ITier[];
  minOrderAmount: number;
  conditions: {
    isActive: boolean;
    appliesToOnSaleItems: boolean;
    appliesToClearance: boolean;
  };
}

interface IConditions {
  isActive: boolean;
  appliesToOnSaleItems: boolean;
  appliesToClearance: boolean;
}

export interface ICommissionConfig {
  _id: string;
  category: {
    title: string;
  };
  commissionType: 'percentage' | 'fixed' | 'tiered';
  value?: number;
  tiers?: ITier[];
  minOrderAmount: number;
  conditions: IConditions;
  createdBy: IUser;
  createdAt: Date;
  updatedAt?: Date;
}
