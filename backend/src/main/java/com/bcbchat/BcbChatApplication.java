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
        //CLIENTES
        Client client1 = Client.builder()
                .id("client-1")
                .name("Fulano da Silva")
                .documentId("12345678901")
                .documentType("CPF")
                .active(true)
                .planType("postpaid")
                .creditLimit(BigDecimal.valueOf(100))
                .monthlyUsed(BigDecimal.ZERO)
                .build();

        clientRepository.save(client1);

        Client client2 = Client.builder()
                .id("client-2")
                .name("Empresa ABC Ltda")
                .documentId("12345678901234")
                .documentType("CNPJ")
                .active(true)
                .planType("prepaid")
                .balance(BigDecimal.valueOf(127.5))
                .monthlyUsed(BigDecimal.ZERO)
                .build();

        clientRepository.save(client2);
       //=======================================
       //CONVERSAS
        Conversation conversation1 = Conversation.builder()
                .id("conv-1")
                .clientId("client-1")
                .recipientId("user-1")
                .recipientName("João da Silva")
                .lastMessageContent("Gostaria de saber mais sobre seus serviços.")
                .lastMessageTime("2025-06-08T14:30:00Z")
                .unreadCount(2)
                .build();

        Conversation conversation2 = Conversation.builder()
                .id("conv-2")
                .clientId("client-1")
                .recipientId("user-2")
                .recipientName("Maria Oliveira")
                .lastMessageContent("Confirmado! Saindo para entrega.")
                .lastMessageTime("2025-06-08T12:15:00Z")
                .unreadCount(0)
                .build();

        conversationRepository.saveAll(Arrays.asList(conversation1, conversation2));

        Conversation conversation3 = Conversation.builder()
                .id("conv-3")
                .clientId("client-2")
                .recipientId("user-3")
                .recipientName("Abgodaldo da Silva Sauro")
                .lastMessageContent("Poderia me enviar mais detalhes sobre o produto?")
                .lastMessageTime("2025-06-08T14:30:00Z")
                .unreadCount(1)
                .build();

        Conversation conversation4 = Conversation.builder()
                .id("conv-4")
                .clientId("client-2")
                .recipientId("user-4")
                .recipientName("Pedro Santos")
                .lastMessageContent("Olá! Como posso ajudá-lo hoje?")
                .lastMessageTime("2025-06-08T12:15:00Z")
                .unreadCount(0)
                .build();
        conversationRepository.saveAll(Arrays.asList(conversation3, conversation4));
        //============================================================================
        //MENSAGENS
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
                .content("Gostaria de saber mais sobre seus serviços.")
                .senderId("user-1")
                .senderType("user")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("sent")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation1.getId())
                .build();

        messageRepository.saveAll(Arrays.asList(message1Conversation1, message2Conversation1));

        Message message1Conversation2 = Message.builder()
                .id("m1c2")
                .content("Boa tarde! Gostaria de confirmar o pedido.")
                .senderId("user-2")
                .senderType("user")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("queued")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation2.getId())
                .build();

        Message message2Conversation2 = Message.builder()
                .id("m2c2")
                .content("Confirmado! Saindo para entrega.")
                .senderId("client-1")
                .senderType("client")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("sent")
                .cost(BigDecimal.valueOf(0.25))
                .conversationId(conversation2.getId())
                .build();

        messageRepository.saveAll(Arrays.asList(message1Conversation2, message2Conversation2));

        Message message1Conversation3 = Message.builder()
                .id("m1c3")
                .content("Poderia me enviar mais detalhes sobre o produto?")
                .senderId("user-3")
                .senderType("user")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("sent")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation3.getId())
                .build();

        Message message1Conversation4 = Message.builder()
                .id("m1c4")
                .content("Preciso de suporte técnico urgente!")
                .senderId("user-4")
                .senderType("user")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("normal")
                .status("sent")
                .cost(BigDecimal.ZERO)
                .conversationId(conversation4.getId())
                .build();

        Message message2Conversation4 = Message.builder()
                .id("m2c4")
                .content("Olá! Como posso ajudá-lo hoje?")
                .senderId("client-2")
                .senderType("client")
                .timestamp(String.valueOf(System.currentTimeMillis()))
                .priority("urgent")
                .status("read")
                .cost(BigDecimal.valueOf(0.50))
                .conversationId(conversation4.getId())
                .build();

        messageRepository.saveAll(Arrays.asList(message1Conversation3, message1Conversation4, message2Conversation4));
    }
//=============================================================================================
}
