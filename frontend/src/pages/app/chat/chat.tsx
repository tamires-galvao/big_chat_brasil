import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { ConversationResponse } from "@/api/conversations";
import { useChatWebSocket } from "@/hook/useChatWebSocket";
import { getProfile } from "@/api/get-profile";
import { getMessageCost, canClientSendMessage } from "@/utils/client";
import { toast } from "sonner";
import { MessageBubble } from "./message-bubble";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderType: "client" | "user";
  timestamp: string;
  priority: "normal" | "urgent";
  status: "queued" | "sent" | "read" | "delivered" | "processing" | "failed";
  cost: number;
}

interface SendMessageBody {
  conversationId: string;
  content: string;
  priority: "normal" | "urgent";
}

export function Chat() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentMessageIds = useRef<Set<string>>(new Set());
  const [isUrgent, setIsUrgent] = useState(false);
  const priority = isUrgent ? "urgent" : "normal";
  const cost = getMessageCost(priority);
  const documentId = localStorage.getItem("clientDocumentId") || "";

  const { data: clientProfileData } = useQuery<Client>({
    queryKey: ["client-profile", documentId],
    queryFn: () => getProfile(documentId),
    enabled: !!documentId,
  });

  const clientProfile: Client | null = clientProfileData ?? null;

  const {
    data: conversation,
    isError: isConversationError,
    isFetching: isConversationFetching,
  } = useQuery<ConversationResponse>({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const response = await api.get(`/conversations/${id}`);
      console.log("Conversation data:", response.data);
      return response.data;
    },
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (!isConversationFetching && isConversationError) {
      navigate("/conversations", { replace: true });
    }
  }, [isConversationError, isConversationFetching, navigate]);

  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery<Message[]>({
    queryKey: ["messages", id],
    queryFn: async () => {
      const response = await api.get(`/conversations/${id}/messages`);
      return response.data;
    },
    enabled: !!id && !!conversation,
  });

  const { mutateAsync: sendMessageRequest } = useMutation({
    mutationFn: async (data: SendMessageBody) => {
      const response = await api.post("/messages/send", data);
      return response.data;
    },
  });

  async function handleSendMessage() {
    if (!message.trim() || !id) return;

    if (!canClientSendMessage(clientProfile, priority)) {
      toast.error(
        "Seu saldo ou limite é insuficiente para enviar essa mensagem."
      );
      return;
    }

    if (message.trim().length > 255) {
      toast.error("Sua mensagem é muito longa. O limite é de 255 caracteres.");
      return;
    }

    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();

    const tempMessage: Message = {
      id: tempId,
      conversationId: id,
      content: message,
      senderId: clientProfile!.id,
      senderType: "client",
      timestamp: now,
      priority,
      status: "queued",
      cost: getMessageCost(priority), // Definir custo temporário
    };

    queryClient.setQueryData<Message[]>(["messages", id], (old = []) => [
      ...old,
      tempMessage,
    ]);

    try {
      setMessage("");
      setIsUrgent(false);
      inputRef.current?.focus();

      const savedMessage = await sendMessageRequest({
        conversationId: id,
        content: message,
        priority,
      });

      await queryClient.refetchQueries({
        queryKey: ["client-profile", documentId],
        exact: true,
      });

      sentMessageIds.current.add(savedMessage.id);

      queryClient.setQueryData<Message[]>(["messages", id], (old = []) =>
        (old || []).map((msg) => (msg.id === tempId ? savedMessage : msg))
      );
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  }

  useChatWebSocket(id!, (raw: Omit<Message, "conversationId">) => {
    const parsed: Message = {
      ...raw,
      conversationId: id!,
    };

    queryClient.setQueryData<Message[]>(["messages", id], (old = []) =>
      (old || []).map((msg) =>
        msg.id === parsed.id ? { ...msg, ...parsed } : msg
      )
    );
  });

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    setTimeout(scrollToBottom, 0);
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 bg-muted/20 min-h-0">
      <div className="sticky top-0 p-3 border-b flex items-center gap-3 bg-background z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/conversations")}
          aria-label="Voltar para a lista de conversas"
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-semibold text-base truncate">
          {conversation?.recipientName}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 scrollbar-custom"
      >
        {isLoading && (
          <p className="text-center text-sm">Carregando mensagens...</p>
        )}
        {isError && (
          <p className="text-center text-sm text-destructive">
            Erro ao carregar mensagens.
          </p>
        )}
        {messages?.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">
            <p className="font-semibold text-base">Nenhuma mensagem ainda.</p>
            <p className="text-sm">Envie uma mensagem para começar.</p>
          </div>
        )}
        {messages?.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={{
              id: msg.id,
              conversationId: msg.conversationId,
              content: msg.content,
              sentBy: {
                id: msg.senderId,
                type: msg.senderType,
              },
              timestamp: msg.timestamp,
              priority: msg.priority,
              status: msg.status,
              cost: msg.cost,
            }}
            clientProfile={clientProfile}
          />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="sticky bottom-0 p-3 border-t bg-background z-10"
        style={{
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
        }}
        role="form"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={isUrgent}
              onCheckedChange={(checked) => setIsUrgent(!!checked)}
            />
            <Label htmlFor="urgent" className="text-sm text-neutral-700">
              Mensagem urgente
              <span className="text-red-600 font-medium ml-1">
                (+R$ {(cost - 0.25).toFixed(2)})
              </span>
            </Label>
          </div>

          <div className="text-xs text-neutral-500">
            Custo: R$ {cost.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="flex-1 rounded-full px-4 py-2 text-sm"
            placeholder="Digite uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Digite sua mensagem"
            ref={inputRef}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-muted rounded-full transition-colors"
            disabled={!message.trim()}
            aria-label="Enviar mensagem"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
