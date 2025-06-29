package com.bcbchat.config;

import com.bcbchat.core.service.AuthService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private final AuthService authService;

    public JwtHandshakeInterceptor(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String token = request.getHeaders().getFirst("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
            try {
                if (authService.isTokenBlacklisted(token)) {
                    return false;
                }
                String clientId = Jwts.parser()
                        .setSigningKey(new SecretKeySpec(
                                JwtConstants.SECRET.getBytes(), SignatureAlgorithm.HS256.getJcaName()
                        ))
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject();
                attributes.put("clientId", clientId);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
    }
}