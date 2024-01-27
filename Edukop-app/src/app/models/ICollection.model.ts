import { IAudit, ICategory, IType } from "@spundan-clients/bookz-interfaces";
import { IBoard } from "./IBoard.model";
import { IProduct } from "./IProduct.model";
import { ISchool } from "./ISchool.model";
import { IUniversity } from "./IUniversity.model";

export interface ICollection extends IAudit {
    uuid: string;
    name: string;
    identifier: string;
    collectionOfProduct: ICollectionOfProduct[];
    expiry_date: Date;
    viewAction: string;
    viewMoreOrgType: string;
    viewMoreRouterLink: string;
}
export interface ICollectionOfProduct {
    productUUID: string;
    sequence: number;
    imageUrl: string;
    product: IProduct | IBoard | ISchool | ICategory | IUniversity;
    action: string;
    typo: IType;
    isRouterLink?: boolean;
    routerLink?: string;
    orgType?: string;
    isCategory?: boolean;
    displayText?: string;
}
