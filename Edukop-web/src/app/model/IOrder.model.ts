import { IOrderStatus } from './IOrderStatus.model';
import { IAddress, IAudit } from '@spundan-clients/bookz-interfaces';
import { IProduct } from './product.model';
import { ICoupon } from './ICoupon.model';
import { CartAddProduct } from './cart.model';
export interface IOrder extends IAudit {
    uuid: string;
    userId: string;
    orderId: string;
    products: IOrderProduct[];
    totalAmount: number;
    status: IOrderStatus;
    shippingId: string;
    address: IAddress;
    paymentId?: string;
    paymentMode?: string;
    refundId?: string;
    razorpayId?: string;
    retryId?: string;
    totalMrp: number;
    discount: number;
    applied_coupon: ICoupon;
    isCart: boolean;
    organization?: string;
    gstNo?: string;
    shipping_amount: number;
}
export interface IAddOrder extends IAudit {
    products: CartAddProduct[];
    isCart: boolean;
    totalAmount: number;
    uuid: string;
    totalMrp: number;
    discount: number;
    applied_coupon: ICoupon;
}
export interface IOrderProduct {
    productUUID: string;
    quantity: number;
    sellingPrice: number;
    mrp: number;
    product: IProduct;
    vendorId: string;
    vendorDetail: any;
    vendorProduct?: any;
    inventory?: any;
}
