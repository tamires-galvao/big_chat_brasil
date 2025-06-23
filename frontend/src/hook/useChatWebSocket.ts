import { Message } from "@/pages/app/chat/chat";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client, over, Message as StompMessage } from "stompjs";

let stompClient: Client | null = null;

export function useChatWebSocket(
  conversationId: string,
  onMessage: (msg: Message) => void
) {
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      stompClient?.subscribe(
        `/topic/conversations/${conversationId}`,
        (message: StompMessage) => {
          if (message.body) {
            onMessage(JSON.parse(message.body));
          }
        }
      );
    });

    return () => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {});
      }
    };
  }, [conversationId]);
}
