import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface IAddressList {
    address: Address[];
}

export interface Address extends IAudit {
    uuid: string;
    userId: string;
    fullName: string;
    city: string;
    address: string;
    landmark: string;
    pincode: number;
    locality: string;
    state: string;
    phone: number;
    isSelect: boolean;
}