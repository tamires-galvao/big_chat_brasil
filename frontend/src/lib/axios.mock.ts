import MockAdapter from "axios-mock-adapter";
import { api } from "./axios";

export function setupMockAPI() {
  const mock = new MockAdapter(api, { delayResponse: 1000 });

  // === LOGIN: POST /authenticate ===
  mock.onPost("/authenticate").reply((config) => {
    const { documentId, documentType } = JSON.parse(config.data);

    if (!documentId || documentId.length < 11) {
      return [400, { message: "Documento inválido" }];
    }

    return [
      200,
      {
        token: "mocked-token-123456",
        client: {
          id: "client-1",
          name: "Empresa Teste",
          documentId,
          documentType,
          planType: "prepaid",
          active: true,
          balance: 100,
        },
      },
    ];
  });

  // === CONVERSAS: GET /conversations ===
  mock.onGet("/conversations").reply(200, [
    {
      id: "conv-1",
      recipientId: "user-1",
      recipientName: "João da Silva",
      lastMessageContent: "Olá, tudo certo?",
      lastMessageTime: "2025-06-08T14:30:00Z",
      unreadCount: 2,
    },
    {
      id: "conv-2",
      recipientId: "user-2",
      recipientName: "Maria Oliveira",
      lastMessageContent: "Pedido confirmado!",
      lastMessageTime: "2025-06-08T12:15:00Z",
      unreadCount: 0,
    },
  ]);

  // === MENSAGENS: GET /conversations/:id/messages ===
  mock.onGet(new RegExp("^/conversations/.+/messages$")).reply((config) => {
    const conversationId = config.url?.match(
      /\/conversations\/(.+)\/messages/
    )?.[1];

    if (conversationId === "conv-1") {
      return [
        200,
        [
          {
            id: "m1",
            content: "Olá, tudo bem?",
            sentBy: { id: "user-1", type: "user" },
            timestamp: new Date().toISOString(),
            priority: "normal",
            status: "sent",
            cost: 0,
          },
          {
            id: "m2",
            content: "Tudo sim, obrigado!",
            sentBy: { id: "client-1", type: "client" },
            timestamp: new Date().toISOString(),
            priority: "normal",
            status: "read",
            cost: 0,
          },
        ],
      ];
    }

    if (conversationId === "conv-2") {
      return [
        200,
        [
          {
            id: "m1",
            content: "Boa tarde! Gostaria de confirmar o pedido.",
            sentBy: { id: "client-1", type: "client" },
            timestamp: new Date().toISOString(),
            priority: "normal",
            status: "queued",
            cost: 0,
          },
          {
            id: "m2",
            content: "Confirmado! Saindo para entrega.",
            sentBy: { id: "user-2", type: "user" },
            timestamp: new Date().toISOString(),
            priority: "normal",
            status: "sent",
            cost: 0,
          },
        ],
      ];
    }

    // fallback
    return [200, []];
  });

  mock.onPost("/messages").reply((config) => {
    const { conversationId, content, priority } = JSON.parse(config.data);

    const sentBy = { id: "client-1", type: "client" as const };

    // Simulação de resposta diferente com base na conversa
    const response = {
      id: String(Date.now()),
      conversationId,
      content,
      sentBy,
      timestamp: new Date().toISOString(),
      priority: priority || "normal",
      status: "queued",
      cost: 0,
    };

    return [200, response];
  });

  // === PERFIL: GET /me ===
  mock.onGet("/me").reply(200, {
    id: "client-1",
    name: "Empresa Teste",
    documentId: "12345678901",
    documentType: "CPF",
    planType: "prepaid",
    active: true,
    balance: 100,
  });
}
