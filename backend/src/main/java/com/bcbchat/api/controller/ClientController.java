package com.bcbchat.api.controller;

import com.bcbchat.core.domain.Client;
import com.bcbchat.core.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;

    @GetMapping("/me")
    public ResponseEntity<Client> getAuthenticatedClient(@AuthenticationPrincipal Client client) {
        return ResponseEntity.ok(client);
    }

    @GetMapping("/me/{documentId}")
    public ResponseEntity<Client> getCurrentClient(@PathVariable String documentId) {
        Client client = clientRepository.findByDocumentId(documentId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return ResponseEntity.ok(client);
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @RequestBody Client client) {
        client.setId(id);
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        clientRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}