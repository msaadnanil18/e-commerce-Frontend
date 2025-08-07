export interface IUser {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  activeRole: 'admin' | 'seller' | 'customer' | 'superAdmin';
  authMethods: AuthMethod[];
  roles: ['admin' | 'seller' | 'customer' | 'superAdmin'];
  sellerId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  passkeys: PasskeyCredential[];
  createdAt: Date;
  updatedAt: Date;
  permissions: [string];
  avatar: any;
  gender: string;
}
