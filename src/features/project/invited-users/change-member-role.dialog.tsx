import RoleBadge from "@/components/role-badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface props {
  currentRole: PROJECT_ROLE;
}

const _schema = z.object({
  role: z.nativeEnum(PROJECT_ROLE),
});
type _schemaDTO = z.infer<typeof _schema>;

function ChangeMemberRole({ currentRole }: props) {
  const form = useForm<_schemaDTO>({
    resolver: zodResolver(_schema),
    defaultValues: {
      role: currentRole,
    },
  });

  async function onSubmit(values: _schemaDTO) {
    try {
      console.log("onSubmit", values);
      //   await assign(values).unwrap();
      form.reset();
    } catch (error) {
      console.error("Ошибка при изменении статуса участника проекта:", error);
    }
  }

  return (
    <>
      <Popover modal={true} onOpenChange={() => form.reset()}>
        <PopoverTrigger>
          <Button asChild variant="ghost" size={"sm"}>
            <RoleBadge role={currentRole} showText={true} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Роль</FormLabel>
                    <Select
                      //   disabled={isLoadingCurrencies}
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
              <Button variant={"outline"} size={"sm"}>
                {"Подтвердить"}
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default ChangeMemberRole;
