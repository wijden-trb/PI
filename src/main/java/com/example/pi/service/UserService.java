package com.example.pi.service;

import com.example.pi.entity.User;
import com.example.pi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Ajouter utilisateur
    public User register(User user) {
        return userRepository.save(user);
    }

    // Récupérer tous les users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}