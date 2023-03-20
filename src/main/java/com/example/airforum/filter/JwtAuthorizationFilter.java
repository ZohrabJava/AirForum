package com.example.airforum.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter
//        implements Ordered
{

//    @Override
//    public int getOrder() {
//        return 1; // set the order of the filter to 1
//    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.replace("Bearer ", "");

        try {
//            Jws<Claims> claims = Jwts.parser().setSigningKey("mySecretKey").parseClaimsJws(token);
            DecodedJWT decodedJWT = this.decodeJWTToken(token);
            String username =  decodedJWT.getSubject();

            List<GrantedAuthority> authorities = new ArrayList<>();
            String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
            Arrays.stream(roles)
                    .forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));

            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (JwtException e) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Invalid token");
        }
        filterChain.doFilter(request, response);
    }
    private DecodedJWT decodeJWTToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256("secret");
        JWTVerifier verifier = JWT.require(algorithm).build();

        return verifier.verify(token);
    }
}
