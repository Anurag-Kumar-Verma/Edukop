import { IAudit } from "@spundan-clients/bookz-interfaces";
import { IUser } from "./IUser.model";

export interface IComment extends IAudit {
    uuid: string;
    news_uuid: string;
    comment_text: string;
    userInfo: IUser
}