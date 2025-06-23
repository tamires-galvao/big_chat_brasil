export interface Client {
  id: string;
  name: string;
  documentId: string;
  documentType: "CPF" | "CNPJ";
  planType: "prepaid" | "postpaid";
  balance: number;
  creditLimit: number;
  active: boolean;
}

export interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sentBy: {
    id: string;
    type: "client" | "user";
  };
  timestamp: string;
  priority: "normal" | "urgent";
  status: "queued" | "processing" | "sent" | "delivered" | "read" | "failed";
  cost: number;
}

export interface Transaction {
  id: string;
  clientId: string;
  messageId: string;
  amount: number;
  type: "message_sent";
  timestamp: string;
  description: string;
}

export type MessageStatus = Message["status"];
export type MessagePriority = Message["priority"];
export type PlanType = Client["planType"];
export type DocumentType = Client["documentType"];
