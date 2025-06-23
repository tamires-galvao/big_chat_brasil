import { formatCurrencyBRL } from "./formatters";
import type { Client } from "@/types";

export function getClientBalanceInfo(client: Client) {
  if (client.planType === "prepaid") {
    const value = client.balance ?? 0;
    return {
      label: "Saldo",
      value: formatCurrencyBRL(value),
      color: value < 10 ? "text-red-600" : "text-green-600",
    };
  } else {
    const remaining = client.creditLimit ?? 0;
    return {
      label: "Limite",
      value: formatCurrencyBRL(remaining),
      color: remaining < 50 ? "text-red-600" : "text-green-600",
    };
  }
}

export function getMessageCost(priority: "normal" | "urgent"): number {
  return priority === "urgent" ? 0.5 : 0.25;
}

export function canClientSendMessage(
  client: Client | null,
  priority: "normal" | "urgent"
): boolean {
  if (!client) return false;

  const cost = getMessageCost(priority);

  if (client.planType === "prepaid") {
    return (client.balance ?? 0) >= cost;
  } else {
    return (client.creditLimit ?? 0) >= cost;
  }
}
