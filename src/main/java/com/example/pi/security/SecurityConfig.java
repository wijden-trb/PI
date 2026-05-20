package com.example.pi.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF — we use stateless JWT
                .csrf(AbstractHttpConfigurer::disable)

                // Session is STATELESS — JWT only
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        // Public endpoints — no token needed
                        .requestMatchers(
                                "/api/auth/**",          // login, register
                                "/login/oauth2/**",      // OAuth2 callback from LinkedIn
                                "/oauth2/**",            // OAuth2 authorization redirect
                                "/api/users/public/**",  // any public user endpoints
                                "/ws/**"                 // WebSocket handshake
                        ).permitAll()
                        // Everything else requires a valid JWT
                        .anyRequest().authenticated()
                )

                // Wire up OAuth2 login — Spring handles the /oauth2/authorization/linkedin redirect
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler)
                        // On failure, redirect Angular to a login page with error param
                        .failureUrl("http://localhost:4200/login?error=oauth_failed")
                )

                // Add JWT filter BEFORE the username/password filter
                // shouldNotFilter() inside JwtFilter skips OAuth2 paths automatically
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
