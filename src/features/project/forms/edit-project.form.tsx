import React, { useEffect } from "react";
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
import { useGetClientsQuery } from "@/shared/api/client.service";
import { useUpdateProjectMutation } from "@/shared/api/projects.service";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

// Схема валидации формы
const editProjectSchema = z.object({
  name: z.string().min(1, "Название проекта обязательно").max(120,'Максимум 120 символов'),
  client_id: z.string().optional(),
  tag_ids: z.array(z.string()).default([]),
});

type EditProjectFormValues = z.infer<typeof editProjectSchema>;

interface EditProjectFormProps {
  projectId: string;
  initialData: EditProjectFormValues;
  onSuccess: () => void;
  onClose: () => void;
}

function EditProjectForm({
  projectId,
  initialData,
  onSuccess,
  onClose,
}: EditProjectFormProps) {
  const { data: clients, isLoading: isLoadingClients } = useGetClientsQuery({
    page: 1,
  });
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  async function onSubmit(values: EditProjectFormValues) {
    try {
      await updateProject({
        id: projectId,
        data: values,
      }).unwrap();

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении проекта:", error);
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

        <DialogFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Обновление..." : "Обновить проект"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default EditProjectForm;
