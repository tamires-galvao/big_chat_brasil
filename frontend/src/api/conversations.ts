import { api } from "@/lib/axios";
import { Message } from "@/pages/app/chat/chat";

export interface ConversationResponse {
  id: string;
  clientId: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

export async function getConversations(): Promise<ConversationResponse[]> {
  const response = await api.get<ConversationResponse[]>("/conversations");
  return response.data;
}

export async function getAllMessagesById(id: string): Promise<Message[]> {
  const response = await api.get<Message[]>(`/conversations/${id}/messages`);
  return response.data;
}
