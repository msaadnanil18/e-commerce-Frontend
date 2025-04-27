import { Product } from './products';
import { IAddress } from './address';
import { ISeller } from './seller';
import { IVariant } from './products';

export interface IOrderItem {
  product: Product;
  seller: ISeller;
  quantityOrdered: number;
  variant: IVariant;
  acceptedQuantity: number;
  price: number;
  promoApplied?: mongoose.Types.ObjectId;
  taxRate?: number;
  shippingStatus: 'pending';
  trackingNumber: string;
  shippedAt: Date;
  status:
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'shipped'
    | 'delivered'
    | 'canceled';
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    _id: string;
    email: string;
  };
  items: IOrderItem[];
  paymentStatus: 'pending' | 'paid' | 'partial';
  shippingAddress: IAddress;
  totalAmount: number;
  taxAmount: number;
  statusHistory: Array<{ status: string; timestamp: Date }>;
  commissionDue?: number;
  deliveryCharge: number;
  serviceCharge: number;
  createdAt: Date;
  updatedAt: Date;
}
