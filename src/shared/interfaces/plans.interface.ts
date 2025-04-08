import { SUBSCRIPTION } from "../enums/sunscriptions.enum";
import { Currency } from "./currency.interface";

export interface Plans {
  id: 1;
  code: SUBSCRIPTION;
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  isActive: boolean;
  features: {
    maxProjects: number | string;
    storageGB: number | string;
    prioritySupport: boolean;
  };
  trialDays: string | number;
  currency: Currency;
}
