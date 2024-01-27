import { IAudit } from "@spundan-clients/bookz-interfaces";
import { IProduct } from "./IProduct.model";

export interface IBrowsingHistory extends IAudit {
    uuid: string;
    userId: string;
    products: IBrowsingProduct[];
    searchString?: string[];
}
export interface IBrowsingProduct {
    productUUID: string;
    insertDate: Date;
    product: IProduct;
}
export interface IBrowsingProductParams {
    uuid: string;
    userId: string;
    searchString?: string;
    products: IBrowsingProduct;
}
