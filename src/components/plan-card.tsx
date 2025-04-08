import { Plans } from "@/shared/interfaces/plans.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { SUBSCRIPTION_STATUS } from "@/shared/enums/sunscriptions.enum";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

export function PlanCard({ plan }: { plan: Plans }) {
  // Helper function to format billing period
  const formatBillingPeriod = (period: string) => {
    switch (period) {
      case "month":
        return "месяц";
      case "year":
        return "год";
      default:
        return period;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{plan.name}</CardTitle>
          {plan.isActive && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              {SUBSCRIPTION_STATUS.ACTIVE}
            </Badge>
          )}
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              {plan.currency.symbol}
              {plan.price}
            </span>
            <span className="text-muted-foreground ml-2">
              / {formatBillingPeriod(plan.billingPeriod)}
            </span>
          </div>
          {plan.trialDays && Number(plan.trialDays) > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {plan.trialDays} дней бесплатного пробного периода
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Включено:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>
                {plan.features.maxProjects === 1
                  ? "1 проект"
                  : `До ${plan.features.maxProjects} проектов`}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{plan.features.storageGB} ГБ хранилища</span>
            </li>
            {plan.features.prioritySupport && (
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Приоритетная поддержка</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Выбрать план</Button>
      </CardFooter>
    </Card>
  );
}
