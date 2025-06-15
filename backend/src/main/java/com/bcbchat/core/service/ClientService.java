package com.bcbchat.core.service;

import com.bcbchat.core.domain.Client;
import com.bcbchat.core.repository.ClientRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional
    public Client createClient(@Valid Client client) {
        validateClient(client);
        if (clientRepository.findByDocumentIdAndDocumentType(client.getDocumentId(), client.getDocumentType()).isPresent()) {
            throw new IllegalArgumentException("Documento já cadastrado");
        }
        return clientRepository.save(client);
    }

    @Transactional(readOnly = true)
    public Client getClientById(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
    }

    @Transactional(readOnly = true)
    public Client getClientByDocument(String documentId, String documentType) {
        return clientRepository.findByDocumentIdAndDocumentType(documentId, documentType)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Transactional
    public Client updateClient(String id, @Valid Client client) {
        Client existingClient = getClientById(id);
        validateClient(client);

        // Verifica unicidade do documento, exceto para o próprio cliente
        Optional<Client> clientWithSameDocument = clientRepository.findByDocumentIdAndDocumentType(client.getDocumentId(), client.getDocumentType());
        if (clientWithSameDocument.isPresent() && !clientWithSameDocument.get().getId().equals(id)) {
            throw new IllegalArgumentException("Documento já cadastrado para outro cliente");
        }

        existingClient.setName(client.getName());
        existingClient.setDocumentId(client.getDocumentId());
        existingClient.setDocumentType(client.getDocumentType());
        existingClient.setBalance(client.getBalance());
        existingClient.setCreditLimit(client.getCreditLimit());
        existingClient.setPlanType(client.getPlanType());
        existingClient.setActive(client.isActive());

        return clientRepository.save(existingClient);
    }

    @Transactional
    public void deleteClient(String id) {
        if (!clientRepository.existsById(id)) {
            throw new IllegalArgumentException("Cliente não encontrado");
        }
        clientRepository.deleteById(id);
    }

    private void validateClient(Client client) {
        if (!"CPF".equals(client.getDocumentType()) && !"CNPJ".equals(client.getDocumentType())) {
            throw new IllegalArgumentException("Tipo de documento inválido. Use 'CPF' ou 'CNPJ'");
        }
        if (client.getDocumentId().length() != ("CPF".equals(client.getDocumentType()) ? 11 : 14)) {
            throw new IllegalArgumentException("Documento inválido. CPF deve ter 11 dígitos, CNPJ deve ter 14 dígitos");
        }
        if (!"prepaid".equals(client.getPlanType()) && !"postpaid".equals(client.getPlanType())) {
            throw new IllegalArgumentException("Tipo de plano inválido. Use 'prepaid' ou 'postpaid'");
        }
        if ("prepaid".equals(client.getPlanType()) &&
                (client.getBalance() == null || client.getBalance().compareTo(BigDecimal.ZERO) < 0)) {
            throw new IllegalArgumentException("Saldo inválido para plano pré-pago");
        }
        if ("postpaid".equals(client.getPlanType()) &&
                (client.getCreditLimit() == null || client.getCreditLimit().compareTo(BigDecimal.ZERO) < 0)) {
            throw new IllegalArgumentException("Limite inválido para plano pós-pago");
        }

    }
}