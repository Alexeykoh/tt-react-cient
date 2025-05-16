import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdvantageCardProps {
  title: string;
  description: string;
}

export function AdvantageCard({ title, description }: AdvantageCardProps) {
  return (
    <Card className="min-w-64 w-full md:w-fit border-dashed border-2 border-primary/40 bg-muted/30">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
