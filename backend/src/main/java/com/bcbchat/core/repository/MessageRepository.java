package com.bcbchat.core.repository;

import com.bcbchat.core.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, String> {

}