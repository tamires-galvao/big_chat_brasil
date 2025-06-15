import { api } from "@/lib/axios";

export interface GetProfileResponse {
  id: string;
  name: string;
  documentId: string;
  documentType: "CPF" | "CNPJ";
  balance?: number;
  creditLimit?: number;
  planType: "prepaid" | "postpaid";
  active: boolean;
}

export async function getProfile(
  documentId: string
): Promise<GetProfileResponse> {
  const response = await api.get<GetProfileResponse>(
    `/clients/me/${documentId}`
  );
  return response.data;
}
