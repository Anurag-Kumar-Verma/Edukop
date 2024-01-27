import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface ISchool extends IAudit {
    uuid: string;
    name: string;
    abbreviation: string;
    address: string;
    imageUrl: string;
    email: string;
    password?: string;
    enableLogin: boolean;
    city: string;
    state: string;
    contact_details: string;
    affiliated_with: string;
    official_language: string;
    isType: string;
    GSTIN: string;
    pincode: number;
    type: string;
    description: string;
}