//package com.example.airforum.filter;
//
//import com.auth0.jwt.JWT;
//import com.auth0.jwt.algorithms.Algorithm;
//import com.example.airforum.controller.UserController;
//import com.example.airforum.convertor.UserConvertor;
//import com.example.airforum.dto.userDto.UserRequestDto;
//import com.example.airforum.dto.userDto.UserResponseDto;
//import com.example.airforum.repository.UserRepository;
//import com.example.airforum.service.UserService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import lombok.AllArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import javax.servlet.FilterChain;
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.util.*;
//import java.util.stream.Collectors;
//
//import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
//
//@AllArgsConstructor
//public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
//
//    private final AuthenticationManager authenticationManager;
//
//    @Override
//    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
//        String username = request.getParameter("username");
//        String password = request.getParameter("password");
//
//        UsernamePasswordAuthenticationToken authenticationToken =
//                new UsernamePasswordAuthenticationToken(username, password);
////        System.out.println(username);
////        if (new findUser().getByUserName(username).get().getEnabled()) {
////         return null;
////        }
//        return authenticationManager.authenticate(authenticationToken);
//    }
//
//    @Override
//    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain
//            chain, Authentication authentication) throws IOException, ServletException {
//        User user = (User) authentication.getPrincipal();
//
//        String username = user.getUsername();
//        String issuer = request.getRequestURL().toString();
//        List<String> userRoles = user.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.toList());
//        Boolean enabled=user.isEnabled();
//        String accessToken = this.generateJWTToken(enabled,username, issuer, userRoles);
//
//        /*String refreshToken = JWT.create()
//                .withSubject(user.getUsername())
//                .withIssuer(request.getRequestURL().toString())
//                .withExpiresAt(new Date(System.currentTimeMillis() + 30 * 60 * 1000))
//                .sign(algorithm);
//        response.setHeader("refresh-token", refreshToken);*/
//
//        //response.setHeader("access-token", accessToken);
//
//        Map<String, String> tokens = new HashMap<>();
//
//        tokens.put("userName",username);
//        tokens.put("access_token", accessToken);
////        tokens.put();
//        response.setContentType(APPLICATION_JSON_VALUE);
//        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
//    }
//
//    private String generateJWTToken(Boolean enabled, String username, String issuer, List<String> roles) {
//        Algorithm algorithm = Algorithm.HMAC256("secret");
//        Date expirationDate = new Date(System.currentTimeMillis() + 1440 * 60 * 1000);
//
//        return JWT.create()
//                .withSubject(username)
//                .withIssuer(issuer)
//                .withExpiresAt(expirationDate)
//                .withClaim("roles", roles)
//                .withClaim("isEnabled",enabled)
//                .sign(algorithm);
//    }
//}
