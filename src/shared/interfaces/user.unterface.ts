export interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  subscriptionType: SubscriptionType;
  created_at: string;
  updated_at: string;
}

export enum SubscriptionType {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
  }
