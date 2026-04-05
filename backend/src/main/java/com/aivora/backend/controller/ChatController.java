package com.aivora.backend.controller;

import com.aivora.backend.dto.ChatRequest;
import com.aivora.backend.dto.ChatResponse;
import com.aivora.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    private final Map<String, List<Map<String, String>>> sessions = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChatRequest request) {

        String sessionKey = authHeader.replace("Bearer ", "");
        sessions.putIfAbsent(sessionKey, new ArrayList<>());
        List<Map<String, String>> history = sessions.get(sessionKey);

        ChatResponse response = chatService.chat(history, request.getMessage());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reset")
    public ResponseEntity<Void> reset(
            @RequestHeader("Authorization") String authHeader) {
        String sessionKey = authHeader.replace("Bearer ", "");
        sessions.remove(sessionKey);
        return ResponseEntity.ok().build();
    }
}