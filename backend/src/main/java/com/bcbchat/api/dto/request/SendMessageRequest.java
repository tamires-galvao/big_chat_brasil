package com.bcbchat.api.dto.request;

import lombok.Data;

@Data
public class SendMessageRequest {

    private String conversationId;

    private String content;

    private String priority; // "normal" ou "urgent"

}