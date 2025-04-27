import { IUser } from './auth';
export interface IAddress {
  _id: string;
  user: IUser;
  street: string;
  city: string;
  state: string;
  name: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  landmark: string;
  alternativePhone: string;
}

export interface AddressFormValues {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  landmark: string;
  alternativePhone: string;
  isDefault: boolean;
}
