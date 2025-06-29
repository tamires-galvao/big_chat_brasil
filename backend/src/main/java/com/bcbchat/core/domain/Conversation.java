package com.bcbchat.core.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Conversation {

    @Id
    private String id;

    private String clientId;

    private String recipientId;

    private String recipientName;

    private String lastMessageContent;

    private String lastMessageTime;

    private int unreadCount;

}
