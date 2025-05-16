import { PAYMENT } from "@/shared/interfaces/task.interface";
import React from "react";

interface Props {
  symbol: string;
  rate: string | number;
  payment_type: PAYMENT;
}

export default function RateItem({ symbol, rate, payment_type }: Props) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-light opacity-75">{"Ставка:"}</p>
      <h6 className="text-md font-semibold">
        {`${symbol}${rate} / ${
          payment_type === PAYMENT.HOURLY ? "почасовая" : "фиксированная"
        }`}
      </h6>
    </div>
  );
}
