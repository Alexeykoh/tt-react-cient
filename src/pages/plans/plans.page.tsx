import { PlanCard } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useGetPlansQuery } from "@/shared/api/plans.service";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlansPage() {
  const { data: plans } = useGetPlansQuery();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4 flex flex-col">
      <div className="flex flex-wrap gap-4">
        <Button size={"icon"} variant={"default"} onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold mb-4">Подписки</h1>
      </div>

      <div className="flex-1 flex flex-col">
        <Carousel className="w-full">
          <CarouselContent className="py-4">
            {plans?.map((plan) => (
              <CarouselItem key={plan.id} className="md:basis-1/2 lg:basis-1/3">
                <PlanCard plan={plan} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="relative static translate-y-0 left-0" />
            <CarouselNext className="relative static translate-y-0 right-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
