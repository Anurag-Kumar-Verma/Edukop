import { IAudit } from "@spundan-clients/bookz-interfaces";
import { IEnrollmentForm } from "./enrollmentForm.model";

export interface IProduct extends IAudit {
    uuid: string;
    refId?: string;
    name: string;
    mrp: number;
    sellingprice: number;
    isType?: string;
    is_grouped: boolean;
    attributes: IProductAttribute[];
    attributeDetails: IAttribute[];
    images: string[];
    hsn?: number;
    sku?: string;
    categories?: string[];
    gstSlab?: number;
    reverseCharge?: string;
    shortDescription: string;
    longDescription: string;
    metaData: IEnrollmentForm;
    isDigital: boolean;
    isDraft: boolean;
    vendorId: string;
    isEditable?: boolean;
    current_inventory?: number;
    max: number;
    min: number;
    length_in_cm: number;
    height_in_cm: number;
    width_in_cm: number;
    weight_in_kg: number;
    products: any;
    mainProductId: string;
}

export interface IProductAttribute {
    attribute_Id: string;
    attribute_value_Id: string[];
}

export interface IAttribute {
    attributeUUID: string;
    attributeName: string;
    attributeType: string;
    attributeValues: IAttributeValues[];
}
export interface IAttributeValues {
    attributeKey: string;
    attributeValue: string;
}

export interface IVariantAttributes {
    attributeIds: string[];
}
export interface IVariantProduct extends IProduct {
    isVariant: boolean;
    mainProductId: string;
}