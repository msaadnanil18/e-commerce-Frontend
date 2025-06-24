import { IProductCategory } from './productCategory';
import { IProduct } from './products';

interface IBannerProduct {
  product: IProduct;
  bannerThumbnail?: any;
  displayOrder: number;
}

interface IMainCategory {
  category: string | IProductCategory;
  position?: number;
  customName?: string;
  customThumbnail?: any;
}

interface IFeaturedCategory {
  category: string | IProductCategory;
  position?: number;
  highlightText?: string;
  badgeText?: string;
}

interface ICategoryDisplay {
  mainCategories: IMainCategory[];
  featuredCategories: IFeaturedCategory[];
}

export interface IHomePageConfig {
  _id: string;
  name: string;
  isActive: boolean;
  featuredProducts: [string];
  bannerProducts: IBannerProduct[];
  categoryDisplay: ICategoryDisplay;
  lastModifiedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  productcategory: Array<IProductCategory>;
}
