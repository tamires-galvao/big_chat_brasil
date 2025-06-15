package com.bcbchat.api.controller;

import com.bcbchat.api.dto.request.SendMessageRequest;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String id) {
        List<Message> messages = messageService.getMessagesByConversationId(id);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody SendMessageRequest request) {
        Message message = messageService.sendMessage(
                request.getConversationId(),
                request.getContent(),
                request.getPriority()
        );
        return ResponseEntity.ok(message);
    }
}
