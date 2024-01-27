import { IProduct } from "./IProduct.model";

export interface IGroupProduct extends IProduct {
    products: IGProduct[];
}
export interface IGProduct {
    uuid: string;
    quantity: number;
    product: IProduct;
}
