import React from "react";
import { Friend } from "@/shared/interfaces/friends.interface";

interface FriendTableRowProps extends Omit<Friend, "email"> {
  email?: string;
  status?: string; // если хотите показывать статус, например "accepted"
}

const FriendTableRow: React.FC<FriendTableRowProps> = ({
  name,
  email,
  status,
}) => {
  return (
    <>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{email || ""}</td>
      <td className="px-4 py-2">{status ?? "-"}</td>
      <td className="px-4 py-2 text-right">
        {/* Здесь можно добавить кнопки действий, например "Удалить", "Принять" и т.п. */}
      </td>
    </>
  );
};

export default FriendTableRow;
