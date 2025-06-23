import { Helmet } from "react-helmet-async";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getConversations } from "@/api/conversations";
import { MessageCircleMore } from "lucide-react";

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function ConversationsPage() {
  const navigate = useNavigate();
  const { id: selectedConversationId } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getConversations().then((conversations) => {
      setFilteredConversations(
        conversations.filter((conv) =>
          conv.recipientName.toLowerCase().includes(search.toLowerCase())
        )
      );
    });
  }, [search]);

  return (
    <>
      <Helmet title="Conversas" />
      <div className="flex flex-col md:grid md:grid-cols-[minmax(250px,350px)_1fr] h-[calc(100vh-3.5rem)] bg-background">
        <aside
          className={cn(
            "border-r bg-background p-4 overflow-y-auto scrollbar-custom",
            isMobile && selectedConversationId ? "hidden" : "flex flex-col"
          )}
        >
          <h1 className="text-lg font-semibold mb-4">Conversas</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar..."
            className="mb-4 rounded-md border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {filteredConversations?.length === 0 && (
            <div className="text-center text-muted-foreground mt-10 flex-1">
              <p className="font-semibold text-base">
                Nenhuma conversa encontrada.
              </p>
              <p className="text-sm">Inicie uma conversa para começar.</p>
            </div>
          )}

          <ul className="space-y-1 flex-1">
            {filteredConversations?.map((conv) => (
              <li
                key={conv.id}
                onClick={() => navigate(`/conversations/${conv.id}`)}
                className={cn(
                  "cursor-pointer rounded-lg p-3 hover:bg-muted/50 transition-colors flex items-center",
                  conv.id === selectedConversationId && "bg-muted"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-base truncate max-w-[60%]">
                      {conv.recipientName}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {isToday(new Date(conv.lastMessageTime))
                        ? format(new Date(conv.lastMessageTime), "HH:mm", {
                            locale: ptBR,
                          })
                        : format(new Date(conv.lastMessageTime), "dd/MM", {
                            locale: ptBR,
                          })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground truncate max-w-[70%]">
                      {conv.lastMessageContent}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-1 ml-2 flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main
          className={cn(
            "flex flex-col h-full overflow-y-auto",
            isMobile && !selectedConversationId && "hidden"
          )}
        >
          {selectedConversationId ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 bg-muted/20">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageCircleMore className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-sm">
                  Escolha uma conversa existente ou inicie uma nova para começar
                  a conversar
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
