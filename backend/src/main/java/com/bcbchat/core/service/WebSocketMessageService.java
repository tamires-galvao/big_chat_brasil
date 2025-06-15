package com.bcbchat.core.service;

import com.bcbchat.core.domain.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketMessageService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyFrontend(Message message) {
        messagingTemplate.convertAndSend("/topic/conversations/" + message.getConversationId(), message);
    }
}