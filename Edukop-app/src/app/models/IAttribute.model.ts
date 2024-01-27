import { IProduct } from "./IProduct.model";

export interface IAttribute {
    attributeUUID: string;
    attributeName: string;
    attributeType: string;
    attributeValues: IAttributeValues[];
}
export interface IAttributeValues {
    attributeKey: string;
    attributeValue: string;
    variantProduct?: IProduct;
    attributeId?: string;
}