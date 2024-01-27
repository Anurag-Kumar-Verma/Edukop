import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface ICourse extends IAudit {
    uuid: string;
    abbreviation: string;
    name: string;
    type: string;
}