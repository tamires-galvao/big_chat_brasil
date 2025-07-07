package com.bcbchat.core.service;

import com.bcbchat.core.domain.Client;
import com.bcbchat.core.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClientServiceTest {

    private ClientRepository clientRepository;
    private ClientService clientService;

    @BeforeEach
    void setup() {
        clientRepository = mock(ClientRepository.class);
        clientService = new ClientService(clientRepository);
    }

    @Test
    void shouldCreateClientSuccessfully() {
        Client client = createValidClient();

        when(clientRepository.findByDocumentIdAndDocumentType("12345678901", "CPF"))
                .thenReturn(Optional.empty());
        when(clientRepository.save(client)).thenReturn(client);

        Client saved = clientService.createClient(client);

        assertEquals("João", saved.getName());
        verify(clientRepository, times(1)).save(client);
    }

    @Test
    void shouldThrowExceptionWhenDocumentAlreadyExists() {
        Client client = createValidClient();

        when(clientRepository.findByDocumentIdAndDocumentType("12345678901", "CPF"))
                .thenReturn(Optional.of(new Client()));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            clientService.createClient(client);
        });

        assertEquals("Documento já cadastrado", exception.getMessage());
        verify(clientRepository, never()).save(any());
    }

    private Client createValidClient() {
        Client client = new Client();
        client.setName("João");
        client.setDocumentId("12345678901");
        client.setDocumentType("CPF");
        client.setPlanType("prepaid");
        client.setBalance(BigDecimal.valueOf(100));
        client.setCreditLimit(BigDecimal.ZERO);
        client.setActive(true);
        return client;
    }
}
