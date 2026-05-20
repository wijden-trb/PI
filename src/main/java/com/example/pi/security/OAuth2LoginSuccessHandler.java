package com.example.pi.security;

import com.example.pi.entity.Role;
import com.example.pi.entity.User;
import com.example.pi.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url}")

    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // LinkedIn uses OpenID Connect → principal is OidcUser
        // Fallback to OAuth2User for other providers
        String email = null;
        String firstName = null;
        String lastName = null;

        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser oidcUser) {
            // OpenID Connect — standard claims
            email     = oidcUser.getEmail();
            firstName = oidcUser.getGivenName();
            lastName  = oidcUser.getFamilyName();

            // Fallback: some LinkedIn setups return name as one field
            if (firstName == null && oidcUser.getFullName() != null) {
                String[] parts = oidcUser.getFullName().split(" ", 2);
                firstName = parts[0];
                lastName  = parts.length > 1 ? parts[1] : "";
            }

        } else if (principal instanceof OAuth2User oauth2User) {
            // Legacy OAuth2 — LinkedIn v2 attribute names
            email     = oauth2User.getAttribute("email");
            firstName = oauth2User.getAttribute("given_name");
            lastName  = oauth2User.getAttribute("family_name");

            if (firstName == null) {
                firstName = oauth2User.getAttribute("localizedFirstName");
                lastName  = oauth2User.getAttribute("localizedLastName");
            }
        }

        if (email == null) {
            // Can't identify user without email — redirect with error
            response.sendRedirect(frontendUrl + "/login?error=no_email");
            return;
        }

        // Find or create the user
        final String finalEmail     = email;
        final String finalFirstName = firstName != null ? firstName : "";
        final String finalLastName  = lastName  != null ? lastName  : "";

        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(finalEmail);
                    newUser.setFirstName(finalFirstName);
                    newUser.setLastName(finalLastName);
                    // No password for OAuth2 users — set a placeholder
                    newUser.setPassword("");
                    // Default role for LinkedIn sign-ups
                    newUser.setRole(Role.STUDENT);
                    return userRepository.save(newUser);
                });

        // Generate JWT exactly like your existing login flow
        String token = jwtService.generateToken(String.valueOf(user));

        // Redirect to Angular /oauth-success with the token as a query parameter
        // Angular will extract it, store it, and navigate to /profile
        String redirectUrl = frontendUrl + "/oauth-success?token=" + token
                + "&userId=" + user.getId();

        response.sendRedirect(redirectUrl);
    }
}
