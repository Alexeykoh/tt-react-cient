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
import { PAYMENT } from "@/shared/interfaces/task.interface";


// Схема валидации формы
const createTaskSchema = z.object({
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
  order: z.number().int().min(0, "Порядок должен быть неотрицательным"),
  currency_id: z.string().min(1, "Валюта обязательна"),
  tag_ids: z.array(z.string()).default([]),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
  onClose: () => void;
  projectId: string;
  projectRate: number;
}

function CreateTaskForm({
  onSuccess,
  onClose,
  projectId,
  projectRate = 0
}: CreateTaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const { data: currencies, isLoading: isLoadingCurrencies } =
    useGetCurrenciesQuery();

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      project_id: projectId,
      description: "",
      is_paid: false,
      payment_type: PAYMENT.HOURLY,
      rate: projectRate,
      order: 0,
      currency_id: "USD",
      tag_ids: [],
    },
  });

  async function onSubmit(values: CreateTaskFormValues) {
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
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Порядок (order)</FormLabel>
              <FormControl>
                <Input
                  type="number"
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

export default CreateTaskForm;
