package com.bcbchat.core.service;

import com.bcbchat.core.domain.Message;
import com.bcbchat.core.repository.ConversationRepository;
import com.bcbchat.core.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class MessageService {

    private final Map<String, List<Message>> messagesByConversation = new HashMap<>();
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final WebSocketMessageService webSocketMessageService;

    public MessageService(MessageRepository messageRepository, ConversationRepository conversationRepository, WebSocketMessageService webSocketMessageService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.webSocketMessageService = webSocketMessageService;

        List<Message> initialMessages = new ArrayList<>();

        initialMessages.add(new Message(
                "m1",
                "c1",
                "Olá, tudo bem?",
                "user-1", "user",
                Instant.now().toString(),
                "normal",
                "sent",
                0
        ));

        initialMessages.add(new Message(
                "m2",
                "c1",
                "Tudo sim, obrigado!",
                "client-1", "client",
                Instant.now().toString(),
                "normal",
                "read",
                0
        ));

        messagesByConversation.put("c1", initialMessages);
    }

    public List<Message> getMessagesByConversationId(String conversationId) {
        return messagesByConversation.getOrDefault(conversationId, new ArrayList<>());
    }

    public Message sendMessage(String conversationId, String content, String priority) {
        Message message = new Message(
                UUID.randomUUID().toString(),
                conversationId,
                content,
                "client-1", "client",
                String.valueOf(System.currentTimeMillis()),
                priority,
                "queued",
                0
        );

        messagesByConversation
                .computeIfAbsent(conversationId, k -> new ArrayList<>())
                .add(message);

        messageRepository.save(message);

        webSocketMessageService.notifyFrontend(message);

        return message;
    }
}
