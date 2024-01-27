export interface User {
    uuid?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    dateOfBirth: string;
    city: string;
    country: string;
    isDeleted?: boolean;
    created_date?: Date;
    modified_date?: Date;
    deleted_date?: Date;
}
