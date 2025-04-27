import { IUser } from './auth';
import { IOrder } from './order';
import { IProduct } from './products';

export interface IReview {
  _id: string;
  product: IProduct;
  customer: IUser;
  order: IOrder;
  rating: number;
  comment: string;
  createdAt: Date;
  attachments: Array<any>;
}
