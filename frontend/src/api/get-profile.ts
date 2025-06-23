import { api } from "@/lib/axios";
import type { Client } from "@/types";

export async function getProfile(documentId: string): Promise<Client> {
  const response = await api.get<Partial<Client>>(`/clients/me/${documentId}`);
  const raw = response.data;

  const client: Client = {
    id: raw.id!,
    name: raw.name!,
    documentId: raw.documentId!,
    documentType: raw.documentType!,
    planType: raw.planType!,
    active: raw.active ?? true,
    balance: raw.balance ?? 0,
    creditLimit: raw.creditLimit ?? 0,
  };

  return client;
}
