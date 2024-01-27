import { IAudit, IUser } from "@spundan-clients/bookz-interfaces";

export interface IComment extends IAudit {
    uuid: string;
    news_uuid: string;
    comment_text: string;
    userInfo: IUser
}