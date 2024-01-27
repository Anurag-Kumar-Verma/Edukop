import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface INews extends IAudit {
    uuid: string;
    news_title: string;
    news_images?: string[];
    numberOfComments: number;
    liked: boolean;
    numberOfLikes: number;
}
