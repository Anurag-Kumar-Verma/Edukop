import { IProductMetaDataType } from "./enrollmentForm.model";

export interface IDownloadProduct {
    path_link: string;
    type: IProductMetaDataType;
    isExternal: boolean;
}