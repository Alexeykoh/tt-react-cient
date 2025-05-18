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
import { useCreateClientMutation } from "@/shared/api/client.service";

// Схема валидации формы
const createClientSchema = z.object({
  name: z.string().min(1, "Название проекта обязательно"),
  contact_info: z.string().min(1, "Выберите валюту"),
});

type CreateClientFormValues = z.infer<typeof createClientSchema>;

interface CreateClientFormProps {
  onSuccess: () => void;
  onClose: () => void; // Добавляем пропс для закрытия формы
}

function CreateClientForm({ onSuccess, onClose }: CreateClientFormProps) {
  const [createProject, { isLoading: isCreating }] = useCreateClientMutation();
  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      contact_info: "",
    },
  });

  async function onSubmit(values: CreateClientFormValues) {

    try {
      await createProject({
        name: values.name,
        contact_info: values.contact_info,
        client_id: ""
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
            {isCreating ? "Создание..." : "Создать клиента"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default CreateClientForm;
