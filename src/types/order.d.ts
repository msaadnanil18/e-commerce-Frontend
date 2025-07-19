import { IProduct, Product } from './products';
import { IAddress } from './address';
import { ISeller } from './seller';
import { IVariant } from './products';
import { IUser } from './auth';

export interface IOrderItem {
  _id?: string;
  product: IProduct;
  seller: ISeller;
  variant: string;
  sku: string;
  variantName: string;

  quantityOrdered: number;
  acceptedQuantity: number;

  unitPrice: number;
  originalPrice: number;

  discountType?: 'percentage';
  discountValue?: number;
  discountAmount?: number;

  tierDiscountType?: 'flat' | 'percentage';
  tierDiscountValue?: number;
  tierDiscountAmount?: number;

  totalDiscount: number;
  finalUnitPrice: number;
  totalAmount: number;

  taxType: 'inclusive' | 'exclusive';
  taxRate: number;
  taxAmount: number;

  attributes: Record<string, any>;
  isMadeOnDemand: boolean;
  shippingTimeline?: string;

  status:
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'shipped'
    | 'delivered'
    | 'canceled'
    | 'returned';

  cancellationReason?: string;
  canceledAt?: Date;
  returnReason?: string;
  returnedAt?: Date;

  shippingStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;

  promoApplied?: Types.ObjectId;

  statusHistory: Array<{
    status: string;
    timestamp: Date;
    reason?: string;
    updatedBy?: IUser;
  }>;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: IUser;

  items: IOrderItem[];

  shippingAddress: IAddress;
  billingAddress?: IAddress;

  subtotal: number;
  itemDiscounts: number;
  couponCode?: string;
  couponDiscount: number;
  totalDiscount: number;

  taxAmount: number;
  deliveryCharge: number;
  serviceCharge: number;
  totalAmount: number;

  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentTransactionId?: string;
  paidAt?: Date;

  overallStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'partially_shipped'
    | 'shipped'
    | 'delivered'
    | 'completed'
    | 'canceled';

  statusHistory: Array<{
    status: string;
    timestamp: Date;
    reason?: string;
    updatedBy?: IUser;
    affectedItems?: any[];
  }>;

  commissionDue: number;
  commissionRate: number;

  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;

  notes?: string;
  internalNotes?: string;

  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}
