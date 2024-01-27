export interface IEnrollmentForm {
    org_id: string;
    enrollmentId: string;
    type: IProductMetaDataType;
}

export declare enum IProductMetaDataType {
    EnrollmentForm = "EnrollmentForm",
    DigitalProduct = "DigitalProduct"
}