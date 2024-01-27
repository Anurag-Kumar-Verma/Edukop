import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface ICoaching extends IAudit {
    uuid: string;
    name: string;
    address: string;
    imageUrl: string;
    contact_details: string;
    mail: string;
    state: string;
    GSTIN: string;
    enableLogin: boolean;
    city: string;
    isType: string;
    pincode: number;
    username: string;
    password: string;
}
