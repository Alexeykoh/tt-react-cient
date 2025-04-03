import { SUNSCRIPTION } from "../enums/sunscriptions.enum";

export interface User {
  user_id: string;
  name: string;
  subscriptionType: SUNSCRIPTION;
  email?: string;
  avatar?: string;
}
