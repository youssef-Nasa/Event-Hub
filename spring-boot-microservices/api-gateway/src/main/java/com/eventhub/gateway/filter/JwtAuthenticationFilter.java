package com.eventhub.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GatewayFilter, Ordered {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final List<String> excludedPaths = List.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/fallback/",
        "/actuator/"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Skip authentication for excluded paths
        if (excludedPaths.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return handleUnauthorized(exchange);
        }

        String token = authHeader.substring(7);
        
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            // Add user info to request headers for downstream services
            ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-Id", claims.getSubject())
                .header("X-User-Email", claims.get("email", String.class))
                .header("X-User-Role", claims.get("role", String.class))
                .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
            
        } catch (Exception e) {
            return handleUnauthorized(exchange);
        }
    }

    private Mono<Void> handleUnauthorized(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
