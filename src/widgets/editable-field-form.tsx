import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  value: string;
  action: (value: string) => void;
}

const fieldSchema = z.object({
  value: z
    .string()
    .nonempty("Поле не должно быть пустым")
    .max(20, "Максимум 20 символов"),
});

type fieldSchemaFormValues = z.infer<typeof fieldSchema>;

export default function EditableFieldForm({ value, action }: Props) {
  const form = useForm<fieldSchemaFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: { value },
  });

  useEffect(() => {
    form.reset({ value });
  }, [value, form]);

  const watchedValue = form.watch("value");
  useEffect(() => {
    if (watchedValue !== value) {
      form.setValue("value", watchedValue, { shouldDirty: true });
    }
  }, [watchedValue, value, form]);

  async function onSubmit({ value }: fieldSchemaFormValues) {
    const drt = form.formState.isDirty;
    if (drt) {
      action(value);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    onBlurCapture={form.handleSubmit(onSubmit)}
                    className="border-none"
                    type="text"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
