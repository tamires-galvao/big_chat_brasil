package com.bcbchat.core.repository;

import com.bcbchat.core.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByClientId(String clientId);
}