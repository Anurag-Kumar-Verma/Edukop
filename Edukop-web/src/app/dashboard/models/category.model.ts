export interface TopCategories {
    uuid: string;
    name: string;
    imageUrl: string;
    filter: string;
    type: string;
}

export interface TopDeals {
    uuid: string;
    imageUrl: string;
    name: string;
    filter: string;
    isDeleted?: boolean;
    created_date?: Date;
    modified_date?: Date;
    deleted_date?: Date;
}
export interface Banner {
    uuid: string;
    imageUrl: string;
    name: string;
    filter: string;
    isDeleted?: boolean;
    created_date?: Date;
    modified_date?: Date;
    deleted_date?: Date;
}

export interface Section {
    uuid: string;
    imageUrl?: string;
    name: string;
    identifier: string;
    collectionOfProduct: CollectionOfProduct[];
    isDeleted?: boolean;
    expiry_date?: Date;
    created_date?: Date;
    modified_date?: Date;
    deleted_date?: Date;
}

export interface CollectionOfProduct {
    uuid: string;
    sequence: number;
    product?: object;
    action: string;
    type: Type;
}

export enum Type {
    School,
    Category,
    Product,
    Board,
    University,
}
