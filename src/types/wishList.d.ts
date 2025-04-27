import { IUser } from './auth';
import { IProduct } from './products';

export interface IWishlist {
  _id: string;
  user: IUser;
  products: Array<IProduct>;
}
