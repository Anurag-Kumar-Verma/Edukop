import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface INews extends IAudit {
    uuid: string;
    news_title: string;
    news_images?: string[];
    liked: boolean;
    numberOfComments: number;
    numberOfLikes: number;
    readMore: boolean;
}