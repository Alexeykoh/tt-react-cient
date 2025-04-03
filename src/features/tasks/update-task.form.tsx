import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateTaskMutation } from "@/shared/api/task.service";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateTaskDto } from "@/shared/interfaces/task.interface";
import { S } from "vitest/dist/chunks/config.d.DevWltVl";

export enum PAYMENT {
  FIXED = "fixed",
  HOURLY = "hourly",
}

// Схема валидации формы
const updateTaskSchema = z.object({
  name: z.string().min(1, "Название задачи обязательно"),
  project_id: z.string().min(1, "Проект обязателен"),
  description: z.string().min(1, "Описание обязательно"), // Убрали .optional()
  is_paid: z.boolean().default(false),
  payment_type: z.nativeEnum(PAYMENT),
  rate: z.union([z.number().min(0), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  currency_id: z.string().min(1, "Валюта обязательна"),
  tag_ids: z.array(z.string()).default([]),
});

type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;

interface UpdateTaskFormProps {
  onSuccess: () => void;
  onClose: () => void;
  projectId: string;
  defaults: UpdateTaskDto;
}

function UpdateTaskForm({
  onSuccess,
  onClose,
  projectId,
  defaults,
}: UpdateTaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const { data: currencies, isLoading: isLoadingCurrencies } =
    useGetCurrenciesQuery();

  const form = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      name: defaults.name,
      project_id: projectId,
      description: defaults.description,
      is_paid: defaults.is_paid,
      payment_type: defaults.payment_type,
      rate: Number(defaults.rate as string) || 0,
      currency_id: defaults.currency_id,
      tag_ids: [],
    },
  });

  async function onSubmit(values: UpdateTaskFormValues) {
    try {
      await createTask(values).unwrap();
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название задачи</FormLabel>
              <FormControl>
                <Input placeholder="Разработка функционала" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-32"
                  placeholder="Детальное описание задачи..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Тип оплаты</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={PAYMENT.FIXED} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Фиксированная ставка
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={PAYMENT.HOURLY} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Почасовая оплата
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.watch("payment_type") === PAYMENT.FIXED
                  ? "Сумма"
                  : "Ставка в час"}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={
                    form.watch("payment_type") === PAYMENT.FIXED ? "1000" : "50"
                  }
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : parseFloat(value));
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
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Создание..." : "Создать задачу"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default UpdateTaskForm;
