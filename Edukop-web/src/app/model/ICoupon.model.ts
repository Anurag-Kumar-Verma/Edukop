export interface ICoupon extends ICashback, CouponExtraFields {
  uuid: string;
  discount_amt_percent_val: number;
  discount_is_amt_percent: boolean;
  discount_max_amt: number;
  discount_min_order: number;
  categories: string[];
  is_shipping_discount: boolean;
  coupon_code: string;
  coupon_start_date: Date;
  coupon_end_date: Date;
  only_new_customers: boolean;
  if_first_n_orders: boolean;
  first_n_orders: number;
  device_restrictions: string[];
  if_cashback: boolean;
  desc: string;
  applied_coupon: string;
}
export interface ICashback {
  amt_percent_val: number;
  is_amt_percent: boolean;
  max_amt: number;
  min_order: number;
  expires_in: Date;
}
export interface CouponExtraFields {
  effectiveAmount: number;
  couponDiscount: number;
  couponCode: string;
  shippingFree: number;
  couponStatus: string;
  reason: string;
}
