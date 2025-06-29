package com.bcbchat.api.controller;

import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor
public class ConversationsController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<List<Conversation>> getConversations() {
        try {
            String clientId = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Conversation> conversations = conversationService.getAllConversationsByClientId(clientId);
            return ResponseEntity.ok(conversations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Conversation> getConversationById(@PathVariable String id) {
        var response = conversationService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String id) {
        try {
            List<Message> messages = conversationService.getAllMessageById(id);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

}