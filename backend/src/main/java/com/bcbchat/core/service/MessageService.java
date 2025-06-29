package com.bcbchat.core.service;

import com.bcbchat.core.domain.Client;
import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.repository.ClientRepository;
import com.bcbchat.core.repository.ConversationRepository;
import com.bcbchat.core.repository.MessageRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class MessageService {

    private final Map<String, List<Message>> messagesByConversation = new HashMap<>();
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final WebSocketMessageService webSocketMessageService;
    private final ClientRepository clientRepository;

    public MessageService(
            MessageRepository messageRepository,
            ConversationRepository conversationRepository,
            WebSocketMessageService webSocketMessageService,
            ClientRepository clientRepository
    ) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.webSocketMessageService = webSocketMessageService;
        this.clientRepository = clientRepository;

        // Mensagens mock iniciais
        List<Message> initialMessages = new ArrayList<>();
        initialMessages.add(new Message(
                "m1", "c1", "Olá, tudo bem?", "user-1", "user",
                Instant.now().toString(), "normal", "sent", BigDecimal.ZERO
        ));
        initialMessages.add(new Message(
                "m2", "c1", "Tudo sim, obrigado!", "client-1", "client",
                Instant.now().toString(), "normal", "read", BigDecimal.ZERO
        ));
        messagesByConversation.put("c1", initialMessages);
    }

    public List<Message> getMessagesByConversationId(String conversationId) {
        String clientId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        if (!conversation.getClientId().equals(clientId)) {
            throw new RuntimeException("Acesso não autorizado à conversa");
        }
        return messageRepository.findByConversationId(conversationId);
    }

    public Message sendMessage(String conversationId, String content, String priority) {
        String clientId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // Verificar se a conversa pertence ao cliente
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        if (!conversation.getClientId().equals(clientId)) {
            throw new RuntimeException("Acesso não autorizado à conversa");
        }

        BigDecimal costDecimal = "urgent".equals(priority)
                ? BigDecimal.valueOf(0.50)
                : BigDecimal.valueOf(0.25);

        // Validação financeira
        if ("prepaid".equals(client.getPlanType())) {
            if (client.getBalance().compareTo(costDecimal) < 0) {
                throw new RuntimeException("Saldo insuficiente.");
            }
        } else {
            if (client.getCreditLimit().compareTo(costDecimal) < 0) {
                throw new RuntimeException("Limite insuficiente.");
            }
        }

        // Desconto
        if ("prepaid".equals(client.getPlanType())) {
            client.setBalance(client.getBalance().subtract(costDecimal));
        } else {
            client.setCreditLimit(client.getCreditLimit().subtract(costDecimal));
        }

        Message message = Message.builder()
                .id(UUID.randomUUID().toString())
                .conversationId(conversationId)
                .content(content)
                .senderId(clientId)
                .senderType("client")
                .timestamp(Instant.now().toString())
                .priority(priority)
                .status("sent")
                .cost(costDecimal)
                .build();

        messageRepository.save(message);
        clientRepository.save(client);
        webSocketMessageService.notifyFrontend(message);

        return message;
    }
}
