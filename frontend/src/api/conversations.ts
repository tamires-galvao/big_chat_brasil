import { api } from "@/lib/axios";
import { Message } from "@/pages/app/chat/chat";

export interface ConversationResponse {
  id: string;
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
  console.log("Requisição para:", `/conversations/${id}/messages`);

  const response = await api.get(
    `http://localhost:8080/conversations/${id}/messages`
  );
  console.log("getAllMessagesById response:", response.data);
  return response.data;
}
