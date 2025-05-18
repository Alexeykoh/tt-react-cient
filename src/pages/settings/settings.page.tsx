import { AccountTab } from "@/components/settings-tab/account-tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const tabsData = [
    {
      value: "account",
      title: "Аккаунт",
      component: AccountTab,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-2xl font-bold mb-4">Настройки</h1>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          <Tabs
            defaultValue={tabsData[0].value}
            className="w-full flex flex-row "
          >
            <TabsList className="grid grid-rows-2 p-2 h-fit bg-transparent w-fit ">
              {tabsData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="items-start justify-start"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabsData.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="w-full p-3"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{tab.title}</CardTitle>
                  </CardHeader>
                  <Separator orientation="horizontal" />
                  <CardContent className="space-y-2">
                    {tab.component && <tab.component />}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
