package com.example.pfe.Controller;

import com.example.pfe.Entity.User;
import com.example.pfe.Repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")

public class UserController {

    @Autowired
    UserRepository userRepository;
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


    @PostMapping("/addUser")
    public ResponseEntity<User> addUser(@RequestBody User user)
    {
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/checkUser/{email}")
    public ResponseEntity<User> check(@PathVariable String email)
    {
        Optional<User> user = userRepository.findByEmail(email) ;
        System.out.println(email);
        System.out.println(user);
        if (user.isPresent())
        return ResponseEntity.ok(user.get());
        else return  null ;

    }

    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email)
    {
        return ResponseEntity.ok(userRepository.findByEmail(email).get());
    }


    @GetMapping("/getAllUsers")

    public ResponseEntity<List<User>> getAllUsers()
    {
        return ResponseEntity.ok(userRepository.findAll());
    }


}
