package com.example.pfe.config;

import com.example.pfe.Entity.User;
import com.example.pfe.Repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil; // your own JWT utility
    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = (String) oauthUser.getAttributes().get("email");
        String name = (String) oauthUser.getAttributes().get("name");

        if (email == null) {
            // fallback logic or throw error
            throw new RuntimeException("Email not found from OAuth2 provider");
        }

        // Generate JWT
        String jwt = jwtUtil.generateToken(email); // assuming your JWT util works with email

        // Return token as JSON response
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//        response.getWriter().write("{\"token\": \"" + jwt + "\"}");
//        response.getWriter().flush();

        String redirectUrl = "http://localhost:4200/oauth2-redirect?token=" + jwt+"&email=" + email;
        response.sendRedirect(redirectUrl);
    }
}
