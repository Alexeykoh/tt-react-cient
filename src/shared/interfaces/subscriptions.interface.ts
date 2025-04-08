import { SUBSCRIPTION, SUBSCRIPTION_STATUS } from "../enums/sunscriptions.enum";

export interface Subscriptions {
  id: 2;
  planId: SUBSCRIPTION;
  status: SUBSCRIPTION_STATUS;
  startDate: string;
  endDate: string;
}
