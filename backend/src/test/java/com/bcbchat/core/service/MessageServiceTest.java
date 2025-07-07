package com.bcbchat.core.service;

import com.bcbchat.core.domain.Client;
import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.repository.ClientRepository;
import com.bcbchat.core.repository.ConversationRepository;
import com.bcbchat.core.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private WebSocketMessageService webSocketMessageService;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private MessageService messageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock authenticated client
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn("client-1");
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
    }

    @Test
    void shouldSendMessageSuccessfullyForPrepaidClient() {
        // Arrange
        String conversationId = "conv-123";
        String content = "Hello!";
        String priority = "normal";

        Client client = Client.builder()
                .id("client-1")
                .planType("prepaid")
                .balance(BigDecimal.valueOf(10))
                .build();

        Conversation conversation = Conversation.builder()
                .id(conversationId)
                .clientId("client-1")
                .build();

        when(clientRepository.findById("client-1")).thenReturn(Optional.of(client));
        when(conversationRepository.findById(conversationId)).thenReturn(Optional.of(conversation));
        when(messageRepository.save(any(Message.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(clientRepository.save(any(Client.class))).thenReturn(client);

        // Act
        Message result = messageService.sendMessage(conversationId, content, priority);

        // Assert
        assertNotNull(result);
        assertEquals("client-1", result.getSenderId());
        assertEquals("sent", result.getStatus());
        assertEquals(BigDecimal.valueOf(0.25), result.getCost());

        verify(messageRepository).save(any(Message.class));
        verify(clientRepository).save(any(Client.class));
        verify(webSocketMessageService).notifyFrontend(any(Message.class));
    }

    @Test
    void shouldThrowExceptionWhenBalanceIsInsufficientForPrepaidClient() {
        // Arrange
        String conversationId = "conv-123";
        String content = "Urgent message";
        String priority = "urgent";

        Client client = Client.builder()
                .id("client-1")
                .planType("prepaid")
                .balance(BigDecimal.valueOf(0.10)) // insufficient balance
                .build();

        Conversation conversation = Conversation.builder()
                .id(conversationId)
                .clientId("client-1")
                .build();

        when(clientRepository.findById("client-1")).thenReturn(Optional.of(client));
        when(conversationRepository.findById(conversationId)).thenReturn(Optional.of(conversation));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            messageService.sendMessage(conversationId, content, priority);
        });

        assertEquals("Saldo insuficiente.", ex.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenConversationIsNotFound() {
        // Arrange
        String conversationId = "non-existent";
        String content = "Some message";
        String priority = "normal";

        // Make sure the client exists
        Client client = Client.builder()
                .id("client-1")
                .planType("prepaid")
                .balance(BigDecimal.valueOf(10))
                .build();
        when(clientRepository.findById("client-1")).thenReturn(Optional.of(client));

        // Simulate missing conversation
        when(conversationRepository.findById(conversationId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            messageService.sendMessage(conversationId, content, priority);
        });

        assertEquals("Conversa não encontrada", ex.getMessage());
    }
}
