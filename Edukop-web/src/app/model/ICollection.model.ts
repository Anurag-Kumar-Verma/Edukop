import { IBoard } from "./IBoard.model";
import { ISchool } from "./ISchool.model";
import { IType } from "./IType";
import { IUniversity } from "./IUniversity.model";
import { IProduct } from "./product.model";

export interface ICollection {
    uuid: string;
    name: string;
    identifier: string;
    collectionOfProduct: ICollectionOfProduct[];
    expiry_date?: Date;
    viewAction?: string;
    viewMoreOrgType?: string;
    viewMoreRouterLink?: string;
}
export interface ICollectionOfProduct {
    productUUID: string;
    sequence: number;
    imageUrl?: string;
    name: string | '';
    // product: IProduct | IBoard | ISchool  | IUniversity;
    product: any;
    action: string;
    typo: IType;
    isRouterLink?: boolean;
    routerLink?: string;
    orgType?: string;
    isCategory?: boolean;
    displayText?: string;
}
