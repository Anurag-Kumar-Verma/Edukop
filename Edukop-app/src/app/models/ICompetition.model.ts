import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface ICompetition extends IAudit {
    uuid: string;
    name: string;
    authority: string;
    website: string;
    abbreviation: string;
    imageUrl: string | null;
    type: string;
    address: string;
    city: string;
    description: string;
}

export interface IExam extends IAudit {
    uuid: string;
    name: string;
    abbreviation: string;
}