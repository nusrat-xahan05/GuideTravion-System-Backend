import { Types } from "mongoose";

export interface ICheckAvailabilityQuery {
    tourId: string;
    startDate: Date;
    endDate: Date;
    persons: number;
}


export type AvailabilityResult =
  | {
      available: true;
      guideId: Types.ObjectId;
      remainingSeats: number;
      message: string;
    }
  | {
      available: false;
      guideId: Types.ObjectId;
      remainingSeats: number;
      reason: string;
    };