import { useMemo } from "react";
import { SUBSCRIPTION } from "../shared/enums/sunscriptions.enum";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";

interface SubscriptionResult {
  access: boolean;
  subscription: SUBSCRIPTION | null;
}

export function useSubscription(
  requiredSubscriptions: SUBSCRIPTION[]
): SubscriptionResult {
  const { data: subscriptionData } = useGetSubscriptionsQuery();

  return useMemo(() => {
    if (!subscriptionData) return { access: false, subscription: null };
  
    const access = requiredSubscriptions.includes(
      subscriptionData?.planId as SUBSCRIPTION
    );
    return { access, subscription: subscriptionData?.planId as SUBSCRIPTION };
  }, [subscriptionData, requiredSubscriptions]);
}
