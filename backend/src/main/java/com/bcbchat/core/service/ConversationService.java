package com.bcbchat.core.service;

import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import com.bcbchat.core.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

import com.bcbchat.core.repository.MessageRepository;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public List<Conversation> getAllConversations() {
        String clientId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return conversationRepository.findByClientId(clientId);
    }

    public Conversation getById(String id) {
        return conversationRepository.findById(id).get();
    }

    public List<Message> getAllMessageById(String conversationId) {
        String clientId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        if (!conversation.getClientId().equals(clientId)) {
            throw new RuntimeException("Acesso não autorizado à conversa");
        }
        return messageRepository.findByConversationId(conversationId);
    }

    public List<Conversation> getAllConversationsByClientId(String clientId) {
        return conversationRepository.findByClientId(clientId);
    }


}