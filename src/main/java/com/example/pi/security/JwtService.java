package com.example.pi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // ✅ SECRET KEY
    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey123456";

    // ✅ Générer clé
    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET.getBytes()
        );
    }

    // ✅ GENERATE TOKEN
    public String generateToken(String email) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis() + 86400000)
                )

                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    // ✅ EXTRACT CLAIMS
    public Claims extractClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(getSigningKey())

                .build()

                .parseClaimsJws(token)

                .getBody();
    }

    // ✅ VALIDATE TOKEN
    public boolean isValid(String token) {

        try {

            Jwts.parserBuilder()

                    .setSigningKey(getSigningKey())

                    .build()

                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}