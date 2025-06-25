package com.example.pfe.Controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")

public class UserController {
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        return principal.getAttributes(); // contains GitHub info
    }
    @GetMapping("/me2")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User user) {
        Map<String, Object> userInfo = new HashMap<>();

        userInfo.put("name", user.getAttribute("name"));
        userInfo.put("login", user.getAttribute("login"));
        userInfo.put("email", user.getAttribute("email"));
        userInfo.put("id", user.getAttribute("id"));

        return userInfo;
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        request.logout(); // Log out from Spring Security
        request.getSession().invalidate(); // Invalidate session
        return ResponseEntity.ok().build(); // Respond with 200 OK
    }
}
