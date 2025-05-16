import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import RoleBadge from "@/components/role-badge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateProjectSharedMutation } from "@/shared/api/projects-shared.service";
import { Input } from "@/components/ui/input";
import { PAYMENT } from "@/shared/interfaces/task.interface";

const schema = z.object({
  project_id: z.string().min(1, "Название задачи обязательно"),
  user_id: z.string().min(1, "Проект обязателен"),
  role: z.nativeEnum(PROJECT_ROLE),
  payment_type: z.nativeEnum(PAYMENT),
  rate: z.union([z.number().min(0), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  currency_id: z.string().min(1, "Валюта обязательна"),
});

type schemaDTO = z.infer<typeof schema>;

interface props {
  onSuccess: () => void;
  onClose: () => void;
  project_id: string;
  user_id: string;
  memberRate: number;
}

export default function InviteUserToProjectForm({
  onSuccess,
  onClose,
  project_id,
  user_id,
  memberRate,
}: props) {
  const { data: currencies, isLoading: isLoadingCurrencies } =
    useGetCurrenciesQuery();
  const [assign, { isLoading: isLoadingAssign }] =
    useCreateProjectSharedMutation();

  const form = useForm<schemaDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: project_id,
      user_id: user_id,
      payment_type: PAYMENT.HOURLY,
      role: PROJECT_ROLE.EXECUTOR,
      rate: memberRate,
      currency_id: "USD",
    },
  });

  async function onSubmit(values: schemaDTO) {
    try {
      await assign(values).unwrap();
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Роль</FormLabel>
              <Select
                disabled={isLoadingCurrencies}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите валюту" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from(Object.values(PROJECT_ROLE))
                    .filter((el) => el !== PROJECT_ROLE.OWNER)
                    .map((_role) => (
                      <SelectItem key={_role} value={_role} className="">
                        <RoleBadge role={_role} />
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип расчета оплаты</FormLabel>
              <Select
                disabled={isLoadingCurrencies}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите способ расчета оплаты" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from(Object.values(PAYMENT))

                    .map((_el) => (
                      <SelectItem key={_el} value={_el} className="">
                        {_el === PAYMENT.FIXED && "Фиксированая стоимость"}
                        {_el === PAYMENT.HOURLY && "Почасовая оплата"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ставка</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  min={0}
                  placeholder="0"
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : parseInt(value, 10));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Валюта</FormLabel>
              <Select
                disabled={isLoadingCurrencies}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите валюту" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies?.data?.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isLoadingAssign}
            isLoading={isLoadingAssign}
          >
            {"Пригласить"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
