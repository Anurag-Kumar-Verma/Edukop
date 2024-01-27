import { IProduct } from "src/app/model/product.model";

export interface IBrowsingHistory {
    uuid: string;
    userId: string;
    products: IBrowsingProduct[];
    searchString?: string[];
}
export interface IBrowsingProduct {
    productUUID: string;
    insertDate?: Date;
    product: IProduct;
}
export interface IBrowsingProductParams {
    uuid: string;
    userId: string;
    searchString?: string;
    products?: IBrowsingProduct;
}