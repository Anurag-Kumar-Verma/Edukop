export interface IUniversity {
    uuid: string;
    name: string;
    abbreviation: string;
    address: string;
    imageUrl: string;
    contact_details: string;
    mail?: string;
    state: string;
    city: string;
    isType: string;
    GSTIN?: string;
    pincode?: number;
    enableLogin: boolean;
    username?: string;
    password?: string;
}