import { useMemo } from 'react';
import { SUNSCRIPTION } from '../shared/enums/sunscriptions.enum';
import { useGetUserQuery } from '../shared/api/user.service';

interface SubscriptionResult {
  access: boolean;
  subscription: SUNSCRIPTION | null;
}

export function useSubscription(requiredSubscriptions: SUNSCRIPTION[]): SubscriptionResult {
  const { data: user } = useGetUserQuery();

  return useMemo(() => {
    if (!user) return { access: false, subscription: null };
    const access = requiredSubscriptions.includes(user.subscriptionType);
    return { access, subscription: user.subscriptionType };
  }, [user, requiredSubscriptions]);
}
