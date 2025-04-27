import { ISeller } from './seller';

export interface Product {
  name: string;
  reason?: string;
  description: string;
  category: string;
  subCategory: string;
  thumbnail: File;

  variants: {
    _id: string;
    sku: string;
    variantName: string;
    originalPrice: number;
    discount: number;
    price: number;
    discount: number;
    attributes: Record<string, any>;
    inventory: number;
    isMadeOnDemand: boolean;
    media: File[];
    shippingTimeline: string;
  }[];
  quantityRules: {
    min: number;
    max: number;
    step: number;
    predefined: number[];
  };
  sellerSpecificDetails: {
    manufacturer: string;
    packaging: string;
    brand: string;
    serviceTerms: string;
    paymentOptions: {
      immediatePayment: boolean;
      deferredPayment: boolean;
    };
  };
  physicalAttributes: {
    weight: number;
    weightUnit: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
      dimensionUnit: sting;
    };
  };
  hsnCode: string;
  taxType: 'inclusive' | 'exclusive';
}

export interface IVariant {
  _id: string;
  sku: string;
  price: number;
  attributes: Record<string, any>;
  inventory: number;
  variantName: string;
  originalPrice: number;
  discount: number;
  isMadeOnDemand: boolean;
  shippingTimeline?: string;
  media: any[];
}

interface IQuantityRules {
  min: number;
  max: number;
  step?: number;
  predefined?: number[];
}

interface ISellerSpecificDetails {
  packaging?: string;
  serviceTerms?: string;
  manufacturer?: String;
  brand?: string;
  paymentOptions: {
    immediatePayment: boolean;
    deferredPayment: boolean;
  };
}

interface IPhysicalAttributes {
  weightUnit: string;
  weight: number;
  dimensions: {
    dimensionUnit: string;
    length: number;
    width: number;
    height: number;
    dimensionUnit: string;
  };
}

interface IStatusLog {
  status: 'pending' | 'approved' | 'restricted' | 'suspended' | 'rejected';
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
  verified: boolean;
}

export interface IProduct {
  _id: string;
  seller: ISeller;
  status: 'pending' | 'approved' | 'restricted' | 'suspended' | 'rejected';
  name: string;
  description?: string;
  reason: string;
  category: any;
  variants: IVariant[];
  quantityRules: IQuantityRules;
  sellerSpecificDetails: ISellerSpecificDetails;
  physicalAttributes: IPhysicalAttributes;
  hsnCode: string;
  taxType: 'inclusive' | 'exclusive';
  createdAt: Date;
  updatedAt: Date;
  thumbnail: any;

  isApproved: boolean;
  statusLogs: IStatusLog[];
}
