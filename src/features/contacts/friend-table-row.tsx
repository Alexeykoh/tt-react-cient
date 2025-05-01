import { Friendship } from "@/shared/interfaces/friends.interface";
import { useGetUserQuery } from "@/shared/api/user.service";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { Button } from "@/components/ui/button";
import { UserRoundCheck, UserRoundX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  useAcceptFriendshipMutation,
  useDeclineFriendshipMutation,
  useCancelFriendshipMutation,
} from "@/shared/api/friendship.service";
import { FriendshipStatus } from "@/shared/enums/friendship.enum";

function FriendTableRow({ sender, status, friendship_id }: Friendship) {
  const { data: userData } = useGetUserQuery();
  const [accept, { isLoading: isLoadingAccept }] =
    useAcceptFriendshipMutation();
  const [decline, { isLoading: isLoadingDecline }] =
    useDeclineFriendshipMutation();
  const [cancel, { isLoading: isLoadingCancel }] =
    useCancelFriendshipMutation();

  return (
    <>
      <td className="px-4 py-2">
        <div className="flex gap-2 items-center p-4">
          <UserAvatar
            size="xs"
            name={sender?.name}
            planId={SUBSCRIPTION.FREE}
          />
          <h2 className="text-sm font-bold">{userData?.name}</h2>
        </div>
      </td>
      <td className="px-4 py-2">{sender.email || ""}</td>
      <td className="px-4 py-2">{status ?? "-"}</td>
      <td className="px-4 py-2 text-right">
        {status === FriendshipStatus.ACCEPTED && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                cancel(friendship_id);
              }}
              isLoading={isLoadingCancel}
              disabled={isLoadingCancel}
            >
              <UserRoundX className="size-4" />
            </Button>
          </>
        )}
        {status === FriendshipStatus.PENDING && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                accept(friendship_id);
              }}
              isLoading={isLoadingAccept}
              disabled={isLoadingAccept}
            >
              <UserRoundCheck className="size-4" />
            </Button>
            <Separator className="min-h-4 border-1" orientation="vertical" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                decline(friendship_id);
              }}
              isLoading={isLoadingDecline}
              disabled={isLoadingDecline}
            >
              <UserRoundX className="size-4" />
            </Button>
          </div>
        )}
      </td>
    </>
  );
}

export default FriendTableRow;
