import { useGetFriendsQuery } from "@/shared/api/friendship.service";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function PeoplesTab() {
  const { data: friends } = useGetFriendsQuery();
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-2">
        <div className="py-4 flex justify-between items-center w-full">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-light text-gray-200">
              Ссылка для приглашения новых участников
            </p>
            <h5 className="text-xs font-light opacity-75">
              Только люди с разрешением на приглашение участников могут видеть
              это.
            </h5>
          </div>
          <Switch
          // checked={field.value}
          // onCheckedChange={field.onChange}
          // disabled
          // aria-readonly
          />
        </div>
      </div>
      <div>
        <h2 className="pb-4">Приглашенные пользователи</h2>
        <Separator />
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px]">Статус</TableHead> */}
              <TableHead>Пользователь</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {friends?.map((el) => (
              <TableRow key={el.user_id}>
                {/* <TableCell className="font-medium">{el.}</TableCell> */}
                <TableCell>{el.name}</TableCell>
                <TableCell>{el.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
