import { IProduct } from "src/app/model/product.model";

export interface Wishlist {
  uuid?: string;
  userId?: string;
  products: WishlistProduct[];
  isDeleted?: boolean;
  created_date?: Date;
  modified_date?: Date;
  deleted_date?: Date;
}

export interface WishlistProduct {
  productUUID: string;
  insertDate: Date;
  product: IProduct;
}
