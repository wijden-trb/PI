package com.example.pi.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage")

    @SendTo("/topic/messages")
    public Map<String, String> sendMessage(
            Map<String, String> message
    ) {

        return message;
    }
}