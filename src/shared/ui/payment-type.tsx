import { PAYMENT } from "@/shared/interfaces/task.interface";

interface props {
  type: PAYMENT;
  varian: "sm" | "md";
}
export default function PaymentType({ type, varian = "md" }: props) {
  switch (type) {
    case PAYMENT.FIXED:
      return (
        <>
          {varian === "md" && "Фиксированная ставка"}
          {varian === "sm" && "фикс."}
        </>
      );
    case PAYMENT.HOURLY:
      return (
        <>
          {varian === "md" && "Почасовая оплата"}
          {varian === "sm" && "ч."}
        </>
      );
    default:
      return <></>;
  }
}
