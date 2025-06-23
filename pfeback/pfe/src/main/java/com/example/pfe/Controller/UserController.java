package com.example.pfe.Controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")

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
}
