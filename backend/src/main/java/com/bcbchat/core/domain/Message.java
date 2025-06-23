package com.bcbchat.core.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Message {

    @Id
    private String id;

    private String conversationId;

    private String content;

    private String senderId;

    private String senderType;

    private String timestamp;

    private String priority; // "normal" | "urgent"

    private String status;   // "queued" | "sent" | "read"

    private BigDecimal cost;

}
