package com.bcbchat.config;

import com.bcbchat.core.service.AuthService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final AuthService authService;

    public WebSocketConfig(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // onde os clientes escutam
        config.setApplicationDestinationPrefixes("/app"); // prefixo para envio
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS(); // endpoint de conexão
    }
}
