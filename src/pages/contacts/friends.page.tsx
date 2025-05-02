import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FriendTableRow from "@/features/contacts/friend-table-row";
import { useGetFriendsQuery } from "@/shared/api/friendship.service";
import SearchWidget from "@/widgets/search.widget";
import { useState } from "react";

function FriendsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: friends } = useGetFriendsQuery(
    { page: currentPage },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      pollingInterval: 5000,
    }
  );

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-xl font-bold ">Друзья</h1>
        <SearchWidget searchLocationList={["users"]} />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <Table className="w-full min-w-[320px]">
          <TableHeader>
            <TableHead></TableHead>
            <TableRow>
              <TableHead className="w-[40%]">Имя</TableHead>
              <TableHead className="w-[30%]">Контакт</TableHead>
              <TableHead className="w-[20%]">Статус</TableHead>
              <TableHead className="w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {friends?.data?.length ? (
              friends?.data?.map((friend) => (
                <TableRow key={friend?.recipient?.name}>
                  <FriendTableRow {...friend} />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={4}
                  className="text-center py-4 text-muted-foreground"
                >
                  {"Друзья не найдены"}
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {friends?.meta && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Страница {friends.meta.page} из {friends.meta.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Назад
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, friends.meta.totalPages)
                  )
                }
                disabled={currentPage >= friends.meta.totalPages}
              >
                Вперед
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsPage;
