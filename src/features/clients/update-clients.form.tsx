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
import { useEditClientsMutation } from "@/shared/api/client.service";
import { EditClientDTO } from "@/shared/interfaces/client.interface";

// Схема валидации формы
const updateClientSchema = z.object({
  name: z.string().min(1, "Название проекта обязательно"),
  contact_info: z.string().min(1, "Выберите валюту"),
});

type UpdateClientFormValues = z.infer<typeof updateClientSchema>;

interface UpdateClientFormProps {
  defaults: EditClientDTO;
  onSuccess: () => void;
  onClose: () => void;
}

function UpdateClientForm({
  defaults,
  onSuccess,
  onClose,
}: UpdateClientFormProps) {
  const [updateClient, { isLoading: isCreating }] = useEditClientsMutation();
  const form = useForm<UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: "",
      contact_info: "",
    },
    values: defaults,
  });

  async function onSubmit(values: UpdateClientFormValues) {
    try {
      await updateClient({
        client_id: defaults.client_id,
        name: values.name,
        contact_info: values.contact_info,
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
              <FormLabel>Наименвоание клиента</FormLabel>
              <FormControl>
                <Input placeholder="B415 inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Контактная информация</FormLabel>
              <FormControl>
                <Input placeholder="b415@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Создание..." : "Изменить клиента"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default UpdateClientForm;
