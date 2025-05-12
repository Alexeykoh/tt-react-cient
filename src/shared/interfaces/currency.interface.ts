import { z } from "zod";

// CurrencySchema
export const CurrencySchema = z.object({
  currency_id: z.union([z.number(), z.string()]),
  name: z.string(),
  code: z.string(),
  symbol: z.string(),
});

// intarfaces
export type Currency = z.infer<typeof CurrencySchema>;
