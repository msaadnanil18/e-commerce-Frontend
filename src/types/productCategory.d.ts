export interface IProductCategory {
  _id: string;
  title: string;
  type: string;
  displayOrder: number;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  thumbnail?: File;
  category?: string;
}
