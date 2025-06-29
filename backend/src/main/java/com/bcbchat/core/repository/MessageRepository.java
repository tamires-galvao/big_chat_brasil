package com.bcbchat.core.repository;

import com.bcbchat.core.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByConversationId(String conversationId);
}