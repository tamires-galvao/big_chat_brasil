import { api } from "@/lib/axios";

export interface AuthRequest {
  documentId: string;
  documentType: "CPF" | "CNPJ";
}

export interface AuthResponse {
  token: string;
  client: {
    id: string;
    name: string;
    documentId: string;
    documentType: "CPF" | "CNPJ";
    balance?: number;
    limit?: number;
    planType: "prepaid" | "postpaid";
    active: boolean;
  };
}

export async function signIn(data: AuthRequest) {
  const response = await api.post<AuthResponse>("/authenticate", data);
  localStorage.setItem("clientDocumentId", response.data.client.documentId);
  return response.data;
}
