package com.bcbchat.api.controller;

import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        var response = conversationService.getAllConversations();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conversation> getConversationById(@PathVariable String id) {
        var response = conversationService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<Message>> getAllMessagesById(@PathVariable String id) {
        var response = conversationService.getAllMessageById(id);
        return ResponseEntity.ok(response);
    }

}