import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ConversationResponse } from "@/api/conversations";
import { useChatWebSocket } from "@/hook/useChatWebSocket";

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderType: "client" | "user";
  timestamp: string;
  priority: "normal" | "urgent";
  status: "queued" | "sent" | "read";
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

  const {
    data: conversation,
    isError: isConversationError,
    isFetching: isConversationFetching,
  } = useQuery<ConversationResponse>({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const response = await api.get(`/conversations/${id}`);
      return response.data;
    },
    enabled: !!id,
    retry: false,
  });

  // Redireciona rapidamente se conversa não existe
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
    enabled: !!id && !!conversation, // só busca mensagens se conversa existir
  });

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async ({ conversationId, content }: SendMessageBody) => {
      const response = await api.post("/messages/send", {
        conversationId,
        content,
        priority: "normal",
      });
      return response.data;
    },
    onSuccess: (newMessage: Message) => {
      sentMessageIds.current.add(newMessage.id);
      queryClient.setQueryData<Message[]>(["messages", id], (old = []) => {
        const messageExists = old.some((m) => m.id === newMessage.id);
        return messageExists ? old : [...old, newMessage];
      });
    },
  });

  async function handleSendMessage() {
    if (!message.trim() || !id) return;

    try {
      await sendMessage({
        conversationId: id,
        content: message,
        priority: "normal",
      });
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }

  useChatWebSocket(id!, (raw: Omit<Message, "conversationId">) => {
    const parsed: Message = {
      ...raw,
      conversationId: id!,
    };

    if (
      sentMessageIds.current.has(parsed.id) ||
      parsed.senderType === "client"
    ) {
      return;
    }

    queryClient.setQueryData<Message[]>(["messages", id], (old = []) => {
      const messageExists = old.some((m) => m.id === parsed.id);
      return messageExists ? old : [...old, parsed];
    });
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
        <button
          onClick={() => navigate("/conversations")}
          aria-label="Voltar para a lista de conversas"
          className="p-2 hover:bg-muted rounded-full transition-colors md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
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
          <div
            key={msg.id}
            className={cn(
              "message-bubble",
              msg.senderType === "client" ? "sent" : "received"
            )}
          >
            <p>{msg.content}</p>
            <span className="text-[10px] opacity-70 block mt-1 text-right">
              {format(new Date(Number(msg.timestamp)), "HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="sticky bottom-0 p-3 border-t flex items-center gap-2 bg-background z-10"
        style={{
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
        role="form"
      >
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite uma mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Digite sua mensagem"
          ref={inputRef}
        />
        <button
          type="submit"
          className="p-2 text-primary hover:bg-muted rounded-full transition-colors"
          disabled={!message.trim()}
          aria-label="Enviar mensagem"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
