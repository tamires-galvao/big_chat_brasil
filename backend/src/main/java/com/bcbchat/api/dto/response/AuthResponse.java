package com.bcbchat.api.dto.response;

import com.bcbchat.core.domain.Client;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private Client client;

}