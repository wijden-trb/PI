package com.example.pi.controller;

import com.example.pi.DTO.LoginRequest;
import com.example.pi.entity.ChatMessage;
import com.example.pi.entity.User;
import com.example.pi.service.ChatService;
import com.example.pi.service.CloudinaryService;
import com.example.pi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/users")   // ✅ VERY IMPORTANT
@CrossOrigin(origins = "http://localhost:4200") // ✅ FIX CORS
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCv(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadFile(file);
            return ResponseEntity.ok(Map.of("secure_url", url)); // ✅ JSON
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.createUser(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @Autowired
    private ChatService chatService;
    @GetMapping("/chat/{user1}/{user2}")
    public List<ChatMessage> getMessages(
            @PathVariable String user1,
            @PathVariable String user2) {

        return chatService.getConversation(user1, user2);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(userService.login(request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}