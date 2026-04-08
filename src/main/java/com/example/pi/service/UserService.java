package com.example.pi.service;

import com.example.pi.entity.User;
import com.example.pi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // REGISTER / CREATE avec validation
    public User createUser(User user) {
        validateUser(user);

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        return userRepository.save(user);
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    // UPDATE USER
    public User updateUser(Long id, User user) {
        validateUser(user);

        User existing = getUserById(id);

        // Vérification email unique si modifié
        if (!existing.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setEmail(user.getEmail());
        existing.setPassword(user.getPassword());
        existing.setRole(user.getRole());
        existing.setSkills(user.getSkills());
        existing.setCvUrl(user.getCvUrl());

        return userRepository.save(existing);
    }

    // DELETE USER
    public void deleteUser(Long id) {
        User existing = getUserById(id);
        userRepository.delete(existing);
    }

    // VALIDATION DES CHAMPS
    private void validateUser(User user) {
        if (!StringUtils.hasText(user.getFirstName())) {
            throw new IllegalArgumentException("First name is required");
        }
        if (!StringUtils.hasText(user.getLastName())) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (!StringUtils.hasText(user.getEmail()) || !user.getEmail().contains("@")) {
            throw new IllegalArgumentException("Valid email is required");
        }
        if (!StringUtils.hasText(user.getPassword()) || user.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (user.getRole() == null) {
            throw new IllegalArgumentException("Role is required");
        }
    }
}