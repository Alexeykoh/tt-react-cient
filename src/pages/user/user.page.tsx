import { useGetUserQuery } from "@/shared/api/user.service";
import { useParams } from "react-router-dom";
import UserMePage from "./tabs/user-me.page";
import UserExternalPage from "./tabs/user-external.page";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userMe } = useGetUserQuery();

  return (
    <div className="flex flex-col w-full h-full">
      {userMe?.user_id === id ? <UserMePage /> : <UserExternalPage />}
    </div>
  );
}
