package com.example.airforum.filter;

import com.auth0.jwt.algorithms.Algorithm;
import com.example.airforum.dto.userDto.UserRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import com.auth0.jwt.JWT;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;


public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        // extract username and password from requestrequest = {HeaderWriterFilter$HeaderWriterRequest@13548}
        String json = "";
        try {
            json = request.getReader().lines().collect(Collectors.joining());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Gson gson = new Gson();
        UserRequestDto dto = gson.fromJson(json, UserRequestDto.class);
        String username = dto.getUserName();
        String password = dto.getPassword();

        // create an authentication object with the user's credentials
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);

        // authenticate the user with the authentication manager
        return authenticationManager.authenticate(authentication);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain filterChain, Authentication authentication) throws IOException {
        // create a JWT token
        List<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        Algorithm algorithm = Algorithm.HMAC256("secret");

        String token = JWT.create()
                .withSubject(authentication.getName())
                .withIssuer(request.getRequestURL().toString())
                .withClaim("roles", userRoles)
                .withClaim("isEnabled", ((User) authentication.getPrincipal()).isEnabled())
                .withExpiresAt(new Date(System.currentTimeMillis() + 86400000))
                .sign(algorithm);

        // add the token to the response header
        response.addHeader("Authorization", "Bearer " + token);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("userName", authentication.getName());
        tokens.put("access_token", token);
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }
}
