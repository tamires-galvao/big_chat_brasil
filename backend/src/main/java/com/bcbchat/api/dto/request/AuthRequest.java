package com.bcbchat.api.dto.request;

import lombok.Data;

@Data
public class AuthRequest {
    private String documentId;
    private String documentType; // "CPF" ou "CNPJ"
}
