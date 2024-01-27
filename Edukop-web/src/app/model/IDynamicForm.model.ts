import { IAudit, IOrgType } from "@spundan-clients/bookz-interfaces";
import { ICoaching } from "./ICoaching.model";
import { ISchool } from "./ISchool.model";
import { IUniversity } from "./IUniversity.model";

export interface IValue {
    key: string;
    value: string;
}

export interface IField {
    sequence: number;
    type: string;
    questionUUID: string;
    questionText: string;
    values: IValue[];
}

export interface IGroup {
    fields: IField[];
    sequence: number;
    title: string;
    repeatFields: boolean;
}

export interface IDynamicForm extends IAudit {
    uuid: string;
    orgType: IOrgType;
    org_id: string;
    orgDetail: IUniversity | ISchool | ICoaching;
    name: string;
    mrp: number;
    coachingDetails: ICoaching;
    schoolDetail: ISchool;
    universityDetails: IUniversity;
    sellingprice: number;
    inventory: number;
    shortDescription: string;
    longDescription: string;
    groups: IGroup[];
}
