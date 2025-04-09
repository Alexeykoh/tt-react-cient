import {
  useEditUserNameMutation,
  useGetUserQuery,
} from "@/shared/api/user.service";
import UserAvatar from "../user-avatar";
import { Loader } from "lucide-react";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditUserNameDTO,
  EditUserNameSchema,
} from "@/shared/interfaces/user.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

export function AccountTab() {
  const { data: userData } = useGetUserQuery();
  const { data: subscriptionData } = useGetSubscriptionsQuery();
  const [editName, { isLoading }] = useEditUserNameMutation();

  const form = useForm({
    resolver: zodResolver(EditUserNameSchema),
    defaultValues: {
      name: userData?.name || "",
    },
  });
  const { isDirty } = form.formState;

  function onSubmit(data: EditUserNameDTO) {
    if (isDirty) {
      editName(data);
    }
  }

  useEffect(() => {
    form.reset({ name: userData?.name || "" });
  }, [userData, form]);

  if (!userData || !subscriptionData) {
    return <Loader className="animate-spin" />;
  }
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <UserAvatar
            size="large"
            name={form.watch("name")}
            planId={subscriptionData?.planId}
          />
        )}

        <div>
          <p className="text-xs font-light opacity-75">Имя</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl style={{ width: "100%" }}>
                      <Input
                        {...field}
                        placeholder="Имя пользователя"
                        className="rounded-lg"
                        onBlur={form.handleSubmit(onSubmit)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <div>
        <h2 className="pb-4">Безопасность учетной записи</h2>
        <Separator />
        <div className="py-4 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="">Email</p>
            <h5 className="text-sm font-light text-gray-400">
              {userData?.email}
            </h5>
          </div>
          <Button variant={"outline"}>Изменть email</Button>
        </div>
        <div className="py-4 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="">Пароль</p>
            <h5 className="text-sm font-light text-gray-400">
              Установите постоянный пароль для входа в свою учетную запись
            </h5>
          </div>
          <Button variant={"outline"}>Изменть пароль</Button>
        </div>
      </div>
    </div>
  );
}
