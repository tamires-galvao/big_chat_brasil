package com.bcbchat.api.controller;

import com.bcbchat.api.dto.request.AuthRequest;
import com.bcbchat.api.dto.response.AuthResponse;
import com.bcbchat.core.domain.Client;
import com.bcbchat.core.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authenticate")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request) {
        try {
            Client client = authService.authenticate(request.getDocumentId(), request.getDocumentType());
            String token = authService.generateToken(client);
            return ResponseEntity.ok(new AuthResponse(token, client));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Erro ao autenticar: " + e.getMessage());
        }
    }

    @PostMapping("/sign-out")
    public ResponseEntity<?> signOut(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.replace("Bearer ", "");
                authService.invalidateToken(token); // Invalida o token (se usar blacklist)
            }
            return ResponseEntity.ok("Sign-out realizado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao realizar sign-out: " + e.getMessage());
        }
    }
}