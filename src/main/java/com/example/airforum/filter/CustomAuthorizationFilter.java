package com.example.airforum.filter;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.example.airforum.service.impl.UserServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component

public class CustomAuthorizationFilter extends OncePerRequestFilter {

    private static final String PREFIX_BEARER = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorizationHeader == null || !authorizationHeader.startsWith(PREFIX_BEARER)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authorizationHeader.substring(7);
            DecodedJWT decodedJWT = this.decodeJWTToken(token);

            String username = decodedJWT.getSubject();
            String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            Arrays.stream(roles)
                    .forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        } catch (Exception e) {
            response.setHeader("error", e.getMessage());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            //response.sendError(HttpServletResponse.SC_FORBIDDEN);
            Map<String, String> error = new HashMap<>();
            error.put("error_message", e.getMessage());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), error);
        }

        filterChain.doFilter(request, response);
    }

    private DecodedJWT decodeJWTToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256("secret");
        JWTVerifier verifier = JWT.require(algorithm).build();

        return verifier.verify(token);
    }

}