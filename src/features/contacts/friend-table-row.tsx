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
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes.enum";
import { Badge } from "@/components/ui/badge";

function FriendTableRow({
  sender,
  recipient,
  friendship_id,
  status,
}: Friendship) {
  const navigate = useNavigate();
  const { data: userData } = useGetUserQuery();
  const [accept, { isLoading: isLoadingAccept }] =
    useAcceptFriendshipMutation();
  const [decline, { isLoading: isLoadingDecline }] =
    useDeclineFriendshipMutation();
  const [cancel, { isLoading: isLoadingCancel }] =
    useCancelFriendshipMutation();

  function isSender() {
    return userData?.user_id === sender.user_id;
  }

  function selectStatus(status: FriendshipStatus) {
    switch (status) {
      case FriendshipStatus.ACCEPTED:
        return (
          <Badge variant={"outline"} className="border-green-600">
            Подтвержден
          </Badge>
        );
      case FriendshipStatus.PENDING:
        return (
          <Badge variant={"outline"} className="border-yellow-600">
            В ожидании
          </Badge>
        );
      case FriendshipStatus.DECLINED:
        return (
          <Badge variant={"outline"} className="border-red-600">
            Отклонен
          </Badge>
        );
    }
  }

  return (
    <>
      <td className="">
        <Button
          variant={"outline"}
          onClick={() =>
            navigate(
              `/${ROUTES.USER}/${isSender() ? recipient.user_id : sender.user_id}`
            )
          }
          className="flex gap-2 items-center p-4 cursor-pointer"
        >
          <UserAvatar
            size="xs"
            name={isSender() ? recipient.name : sender.name}
            planId={SUBSCRIPTION.FREE}
          />
          <h2 className="text-sm font-bold">
            {isSender() ? recipient.name : sender.name}
          </h2>
        </Button>
      </td>
      <td className="px-4 py-2">
        {isSender() ? recipient.email : sender.email}
      </td>
      <td className="px-4 py-2">{selectStatus(status)}</td>
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
            {!isSender() && (
              <>
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
                <Separator
                  className="min-h-4 border-1"
                  orientation="vertical"
                />
              </>
            )}
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
