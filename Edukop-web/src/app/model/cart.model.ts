import { ICoupon } from "./ICoupon.model";
import { IProduct } from "./product.model";

export interface ICart {
    uuid: string;
    userId: string;
    products: CartProduct[];
    totalAmount: number;
    totalMrp: number;
    discount?: number;
    applied_coupon?: ICoupon;
    couponId?: string;
}

export interface CartProduct {
    productUUID: string;
    quantity: number;
    sellingPrice: number;
    mrp: number;
    product: IProduct;
    vendorId: string;
    vendorDetail?: any;
    vendorProduct?: any;
    inventory?: any;
}
export interface CartAddProduct {
    product?: IProduct;
    productUUID: string;
    quantity: number;
    sellingPrice?: number;
    vendorDetail?: any;
    inventory?: any;
    vendorId: string;
}