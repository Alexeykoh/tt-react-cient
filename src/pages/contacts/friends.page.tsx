import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FriendTableRow from "@/features/contacts/friend-table-row";
import { useGetFriendsQuery } from "@/shared/api/friendship.service";
import SearchInputWidget from "@/widgets/search-input.widget";

function FriendsPage() {
  // const [currentPage, setCurrentPage] = useState(1);
  const { data: friends } = useGetFriendsQuery();

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <div className="flex gap-2 items-center">
        <h1 className="text-xl font-bold ">Клиенты</h1>
        <SearchInputWidget searchLocationList={["users", "clients"]} />
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
            {friends?.length ? (
              friends?.map((friend) => (
                <TableRow key={friend.user_id}>
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
      </div>
    </div>
  );
}

export default FriendsPage;
