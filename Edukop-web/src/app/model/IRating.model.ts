import { IAudit } from "@spundan-clients/bookz-interfaces";

export interface IRating extends IAudit {
  uuid?: string;
  stars: number;
  product_uuid: string;
}

export interface IRatingResponse {
  average_stars: number;
  ratings: [
    {
      _id: number;
      numberofRating: number;
    }
  ];
  totalRateCount: number;
  _id: string;
}
