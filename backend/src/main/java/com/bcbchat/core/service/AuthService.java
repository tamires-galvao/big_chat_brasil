package com.bcbchat.core.service;

import com.bcbchat.config.JwtConstants;
import com.bcbchat.core.domain.Client;
import com.bcbchat.core.repository.ClientRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    private static final SecretKey SECRET_KEY_SPEC = new SecretKeySpec(
            JwtConstants.SECRET.getBytes(),
            SignatureAlgorithm.HS256.getJcaName()
    );

    private final Set<String> blacklistedTokens = new HashSet<>(); // Lista de bloqueio

    private final ClientRepository clientRepository;

    public AuthService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client authenticate(String documentId, String documentType) {
        Optional<Client> client = clientRepository.findByDocumentIdAndDocumentType(documentId, documentType);

        if (client.isPresent()) {
            return client.get();
        }

        throw new UsernameNotFoundException("Client inexistente");
    }

    public String generateToken(Client client) {
        return Jwts.builder()
                .setSubject(client.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 horas
                .signWith(SECRET_KEY_SPEC)
                .compact();
    }

    public void invalidateToken(String token) {
        blacklistedTokens.add(token); // Adiciona o token à lista de bloqueio
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token); // Verifica se o token está na lista de bloqueio
    }

}