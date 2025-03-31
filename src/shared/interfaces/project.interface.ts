import { Client } from "./client.interface";
import { Currency } from "./currency.interface";

export interface Project {
  project_id: string;
  name: string;
  created_at: string;
  rate: string;
  currency: Currency;
  client: Client;
}
