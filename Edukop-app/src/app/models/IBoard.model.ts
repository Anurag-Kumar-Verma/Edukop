import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface IBoard extends IAudit {
    uuid: string;
    name: string;
    abbreviation: string;
    imageUrl: string | null;
    type: string;
    address: string;
    state: string;
    city: string;
    description: string
}
