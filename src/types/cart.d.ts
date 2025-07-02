import { Product, IProduct } from './products';
import { ISeller } from './seller';

export interface ICartItem {
  _id: string;
  product: IProduct;
  variant: string;
  seller: ISeller;
  quantity: number;
  price: number;
  total: number;
  discountType?: 'percentage';
  discountValue?: number;
  discountAmount?: number;

  tierDiscountType?: 'flat' | 'percentage';
  tierDiscountValue?: number;
  tierDiscountAmount?: number;

  totalDiscount?: number;
  finalPrice: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  discount: number;
  finalPrice: number;
}
