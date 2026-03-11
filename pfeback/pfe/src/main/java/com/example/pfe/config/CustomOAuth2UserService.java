package com.example.pfe.config;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        // Copy existing attributes
        Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());

        // Fetch email if not present
        String email = (String) attributes.get("email");
        if (email == null) {
            OAuth2AccessToken accessToken = userRequest.getAccessToken();

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken.getTokenValue());
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            List<Map<String, Object>> emails = response.getBody();
            if (emails != null) {
                Optional<String> primaryEmail = emails.stream()
                        .filter(e -> Boolean.TRUE.equals(e.get("primary")))
                        .map(e -> (String) e.get("email"))
                        .findFirst();
                email = primaryEmail.orElse(null);
            }

            attributes.put("email", email);
        }

        // If name is missing, fall back to login
        if (attributes.get("name") == null && attributes.get("login") != null) {
            attributes.put("name", attributes.get("login"));
        }

        return new DefaultOAuth2User(
                oauth2User.getAuthorities(),
                attributes,
                "login" // the key to use as the name attribute
        );
    }
}
