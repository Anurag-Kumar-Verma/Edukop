export interface IEnrollmentForm {
    org_id: string;
    enrollmentId: string;
    type: IProductMetaDataType;
    path_link: string;
}

export declare enum IProductMetaDataType {
    EnrollmentForm = "EnrollmentForm",
    DigitalProduct = "DigitalProduct"
}