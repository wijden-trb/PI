package com.example.pi.repository;

import com.example.pi.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
            String s1, String r1, String s2, String r2
    );
}
