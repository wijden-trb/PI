package com.example.pi.service;

import com.example.pi.entity.ChatMessage;
import com.example.pi.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository repo;

    public ChatMessage save(ChatMessage msg) {
        msg.setTimestamp(LocalDateTime.now());
        return repo.save(msg);
    }

    public List<ChatMessage> getConversation(String user1, String user2) {
        return repo.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
                user1, user2, user2, user1
        );
    }
}
