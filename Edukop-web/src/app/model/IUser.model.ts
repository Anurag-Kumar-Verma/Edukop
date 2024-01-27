import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface IUser extends IAudit {
  _id?: string;
  uuid: string;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  phoneNo?: string;
  dateOfBirth?: string;
  imageUrl?: string;
  city?: string;
  provider?: string;
  role: string;
  isGuest: boolean;
  allow_digital?: boolean;
  country?: string;
  otp?: string;
  facebookId?: string;
  isVerified?: boolean;
}