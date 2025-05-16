import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TableCaption,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import UserAvatar from "@/components/user-avatar";
import {
  useGetFriendByIdQuery,
  useRequestFriendshipMutation,
} from "@/shared/api/friendship.service";
import { useGetUserByIdQuery } from "@/shared/api/user.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { FolderGit2, Loader, SquareCheck } from "lucide-react";
import { useParams } from "react-router-dom";

export default function UserExternalPage() {
  const { id } = useParams<{ id: string }>();
  const { data: friendData } = useGetFriendByIdQuery(id || "", { skip: !id });
  const [sendFriendsipRequest] = useRequestFriendshipMutation();
  const { data: userData, isLoading } = useGetUserByIdQuery(id || "", {
    skip: !id,
  });

  if (!userData) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 items-center p-4">
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <UserAvatar
            size="small"
            name={userData?.name}
            planId={SUBSCRIPTION.FREE}
          />
        )}
        <h2 className="text-xl font-bold">{userData?.name}</h2>
        {friendData && (
          <>
            {friendData?.status === "accepted" && (
              <Badge className="">Друг</Badge>
            )}
            {friendData?.status === "pending" && (
              <Badge variant={"outline"}>Запрос отправлен</Badge>
            )}
          </>
        )}
        {!friendData && (
          <Button onClick={() => sendFriendsipRequest(id || "")} size={"sm"}>
            Добавить в друзья
          </Button>
        )}
      </div>
      <div className="flex flex-col p-4 w-full gap-8">
        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 pb-4">
            <FolderGit2 className="size-5" />
            <h2 className="font-semibold">Совместные проекты</h2>
          </div>
          <Separator />
          <div className="py-4 flex justify-between items-center">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{/* {invoices.map((invoice) => ( */}</TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 pb-4">
            <SquareCheck className="size-5" />
            <h2 className="font-semibold">Совместные задачи</h2>
          </div>
          <Separator />
          <div className="py-4 flex justify-between items-center">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{/* {invoices.map((invoice) => ( */}</TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
