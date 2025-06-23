export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatCPF(value: string): string {
  return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function formatCNPJ(value: string): string {
  return value.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

/**
 * Detecta e formata automaticamente um documento como CPF ou CNPJ.
 */
export function formatDocument(
  type: string | undefined,
  value: string | undefined
): string {
  if (!type || !value) return "";
  if (type === "CPF") return formatCPF(value);
  if (type === "CNPJ") return formatCNPJ(value);
  return value;
}

/**
 * Formata uma data para (dd/mm/aaaa).
 */
export function formatDateBR(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR");
}

/**
 * Formata uma data e hora para (dd/mm/aaaa hh:mm).
 */
export function formatDateTimeBR(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
