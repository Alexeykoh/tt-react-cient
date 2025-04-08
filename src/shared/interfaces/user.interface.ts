import { SUBSCRIPTION } from "../enums/sunscriptions.enum";

export interface User {
  user_id: string;
  name: string;
  subscriptionType: SUBSCRIPTION;
  email?: string;
  avatar?: string;
}
