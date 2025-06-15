package com.bcbchat.core.repository;

import com.bcbchat.core.domain.Conversation;
import com.bcbchat.core.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @Query("SELECT m FROM Message m WHERE m.conversationId = :conversationId ORDER BY m.timestamp ASC")
    List<Message> findAllMessages(String conversationId);

}