import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
const variantByType = {
  [SUBSCRIPTION.FREE]: "variant3",
  [SUBSCRIPTION.BASIC]: "variant1",
  [SUBSCRIPTION.PREMIUM]: "variant2",
};

export function getAvatarUrl(seed: string, type: SUBSCRIPTION = SUBSCRIPTION.FREE) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}&backgroundColor=000000&mouth=${variantByType[type as SUBSCRIPTION]}`;
}
