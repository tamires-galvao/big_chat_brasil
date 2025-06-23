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
    creditLimit?: number;
    monthlyUsed?: number;
    planType: "prepaid" | "postpaid";
    active: boolean;
  };
}

function normalizeDocument(doc: string): string {
  return doc.replace(/[^\d]/g, "");
}

export async function signIn(data: AuthRequest) {
  const cleanedDoc = normalizeDocument(data.documentId);
  const documentType = data.documentType.toUpperCase() as "CPF" | "CNPJ";

  const response = await api.post<AuthResponse>("/authenticate", {
    documentId: cleanedDoc,
    documentType,
  });

  localStorage.setItem("clientDocumentId", cleanedDoc);
  console.log("Client document ID stored in localStorage:", cleanedDoc);
  return response.data;
}
