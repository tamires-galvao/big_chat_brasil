import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, CheckCheck, Clock, AlertTriangle, XCircle } from "lucide-react";
import type { Message, Client } from "@/types";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
  message: Message;
  clientProfile?: Client | null;
}

export function MessageBubble({ message, clientProfile }: MessageBubbleProps) {
  const isFromClient =
    message.sentBy.type === "client" && clientProfile?.id === message.sentBy.id;

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "Agora";
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "queued":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "processing":
        return (
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
        );
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-600" />;
      case "failed":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getBubbleStyles = () => {
    if (isFromClient) {
      return message.priority === "urgent"
        ? "bg-red-100 text-red-900 border border-red-300 ml-12"
        : "bg-yellow-100 text-yellow-900 ml-12";
    }
    return "bg-gray-100 text-gray-900 mr-12";
  };

  const getTimestampAlignment = () => {
    return isFromClient ? "text-right" : "text-left";
  };

  return (
    <div
      className={`animate-fade-in ${
        isFromClient ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <div className="max-w-xs lg:max-w-md">
        <div className={`px-4 py-3 rounded-2xl ${getBubbleStyles()}`}>
          {message.priority === "urgent" && isFromClient && (
            <Badge variant="destructive" className="mb-2 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1 inline" />
              URGENTE
            </Badge>
          )}

          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        <div
          className={`flex items-center space-x-1 mt-1 px-1 ${getTimestampAlignment()}`}
        >
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>

          {isFromClient && (
            <div className="flex items-center space-x-1">
              {message.cost === undefined ? (
                <span className="text-xs text-gray-400 animate-pulse">
                  • calculando...
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  • R$ {Number(message.cost).toFixed(2)}
                </span>
              )}
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
