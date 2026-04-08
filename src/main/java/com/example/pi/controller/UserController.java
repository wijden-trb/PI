package com.example.pi.controller;

import com.example.pi.entity.User;
import com.example.pi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // GET ALL USERS
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}