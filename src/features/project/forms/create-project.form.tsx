import React from "react";
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

import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import { useGetClientsQuery } from "@/shared/api/client.service";
import { useCreateProjectMutation } from "@/shared/api/projects.service";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Схема валидации формы
const createProjectSchema = z.object({
  name: z.string().min(1, "Название проекта обязательно").max(120,'Максимум 120 символов'),
  currency_id: z.string().min(1, "Выберите валюту"),
  rate: z.coerce.number().min(0, "Ставка должна быть положительным числом"),
  client_id: z.string().optional(),
  tag_ids: z.array(z.string()).default([]),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  onSuccess: () => void;
  onClose: () => void; // Добавляем пропс для закрытия формы
}

function CreateProjectForm({ onSuccess, onClose }: CreateProjectFormProps) {
  const { data: currencies, isLoading: isLoadingCurrencies } =
    useGetCurrenciesQuery();
  const { data: clients, isLoading: isLoadingClients } = useGetClientsQuery({
    page: 1,
  });
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      rate: 1,
      currency_id: String(currencies?.data[0]?.code || 'USD'),
      tag_ids: [],
    },
  });

  async function onSubmit(values: CreateProjectFormValues) {
    try {
      await createProject({
        name: values.name,
        currency_id: values.currency_id,
        rate: values.rate,
        client_id: values.client_id || null,
        tag_ids: values.tag_ids,
      }).unwrap();

      form.reset();
      onSuccess();
      onClose(); // Закрываем форму после успешного создания проекта
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
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
              <FormLabel>Название проекта</FormLabel>
              <FormControl>
                <Input placeholder="Введите название проекта" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Клиент</FormLabel>
              <div className="flex items-center">
                <Select
                  disabled={isLoadingClients}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите клиента (опционально)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients?.data.map((client) => (
                      <SelectItem
                        key={client.client_id}
                        value={client.client_id}
                      >
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => form.setValue("client_id", "")}
                  className="ml-2"
                >
                  <span className="material-icons">
                    <X />
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <div>
          <h2 className="font-semibold">Настройки стоимости ваших услуг</h2>
          <div className="flex flex-col gap-4 pl-4 pt-4">
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

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ставка</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Введите ставку"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Создание..." : "Создать проект"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default CreateProjectForm;
