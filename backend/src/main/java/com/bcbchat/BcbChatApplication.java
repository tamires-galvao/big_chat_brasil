package com.bcbchat;

import com.bcbchat.core.domain.Client;
import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.repository.ClientRepository;
import com.bcbchat.core.repository.ConversationRepository;
import com.bcbchat.core.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.math.BigDecimal;
import java.util.Arrays;

@SpringBootApplication
@RequiredArgsConstructor
public class BcbChatApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(BcbChatApplication.class, args);
    }

    private final ClientRepository clientRepository;

    private final ConversationRepository conversationRepository;

    private final MessageRepository messageRepository;

    @Override
    public void run(String... args) throws Exception {
        Client client1 = Client.builder()
                .id("client-1")
                .name("Empresa Teste")
                .documentId("12345678901")
                .documentType("CPF")
                .active(true)
                .planType("postpaid")
                .creditLimit(BigDecimal.valueOf(100))
                .monthlyUsed(BigDecimal.ZERO)
                .build();

        clientRepository.save(client1);

        Conversation conversation1 = Conversation.builder()
                .id("conv-1")
                .recipientId("user-1")
                .recipientName("João da Silva")
                .lastMessageContent("Olá, tudo certo?")
                .lastMessageTime("2025-06-08T14:30:00Z")
                .unreadCount(2)
                .build();

        Conversation conversation2 = Conversation.builder()
                .id("conv-2")
                .recipientId("user-2")
                .recipientName("Maria Oliveira")
                .lastMessageContent("Pedido confirmado!")
                .lastMessageTime("2025-06-08T12:15:00Z")
                .unreadCount(0)
                .build();

        conversationRepository.saveAll(Arrays.asList(conversation1, conversation2));

        Message message1Conversation1 = Message.builder()
                .id("m1c1")
                .content("Olá, tudo bem?")
                .senderId("user-1")
                .senderType("user")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("sent")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation1.getId())
                .build();

        Message message2Conversation1 = Message.builder()
                .id("m2c1")
                .content("Tudo sim, obrigado!")
                .senderId("client-1")
                .senderType("client")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("read")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation1.getId())
                .build();

        messageRepository.saveAll(Arrays.asList(message1Conversation1, message2Conversation1));

        Message message1Conversation2 = Message.builder()
                .id("m1c2")
                .content("Boa tarde! Gostaria de confirmar o pedido.")
                .senderId("client-1")
                .senderType("client")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("queued")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation2.getId())
                .build();

        Message message2Conversation2 = Message.builder()
                .id("m2c2")
                .content("Confirmado! Saindo para entrega.")
                .senderId("user-2")
                .senderType("user")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("sent")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation2.getId())
                .build();

        messageRepository.saveAll(Arrays.asList(message1Conversation2, message2Conversation2));
    }

}
