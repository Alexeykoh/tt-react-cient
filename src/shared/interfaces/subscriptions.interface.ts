import { SUBSCRIPTION, SUBSCRIPTION_STATUS } from "../enums/sunscriptions.enum";

export interface Subscriptions {
  id: number | string;
  planId: SUBSCRIPTION;
  status: SUBSCRIPTION_STATUS;
  startDate: string;
  endDate: string;
}
