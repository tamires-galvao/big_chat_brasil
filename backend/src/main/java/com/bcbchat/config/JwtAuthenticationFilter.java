package com.bcbchat.config;

import com.bcbchat.core.service.AuthService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final AuthService authService;

    public JwtAuthenticationFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");
            logger.debug("Token: {}", token);
            try {
                if (authService.isTokenBlacklisted(token)) {
                    logger.debug("Token is blacklisted: {}", token);
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Token inválido: token foi invalidado");
                    return;
                }

                String clientId = Jwts.parser()
                        .setSigningKey(new SecretKeySpec(
                                JwtConstants.SECRET.getBytes(), SignatureAlgorithm.HS256.getJcaName()
                        ))
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject();
                logger.debug("Client ID: {}", clientId);

                if (clientId != null) {
                    SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(clientId, null, Collections.emptyList())
                    );
                    logger.debug("Authentication set for client: {}", clientId);
                }
            } catch (Exception e) {
                logger.error("Failed to validate JWT token: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            logger.debug("No Bearer token found in request");
        }
        chain.doFilter(request, response);
    }
}