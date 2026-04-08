package com.aivora.backend.controller;

import com.aivora.backend.model.ChatSession;
import com.aivora.backend.repository.ChatSessionRepository;
import com.aivora.backend.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/history")
@RequiredArgsConstructor
public class ChatHistoryController {

    private final ChatSessionRepository repo;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<List<ChatSession>> getHistory(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(repo.findByUserEmailOrderByUpdatedAtDesc(email));
    }

    @PostMapping("/save")
    public ResponseEntity<ChatSession> saveSession(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) throws Exception {
        String email = extractEmail(authHeader);
        String title = (String) body.getOrDefault("title", "Новый чат");
        String messages = objectMapper.writeValueAsString(body.get("messages"));

        Long sessionId = body.get("sessionId") != null ?
                Long.valueOf(body.get("sessionId").toString()) : null;

        ChatSession session;
        if (sessionId != null && repo.existsById(sessionId)) {
            session = repo.findById(sessionId).get();
            session.setMessages(messages);
            session.setTitle(title);
        } else {
            session = ChatSession.builder()
                    .userEmail(email)
                    .title(title)
                    .messages(messages)
                    .build();
        }
        return ResponseEntity.ok(repo.save(session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        String email = extractEmail(authHeader);
        repo.findById(id).ifPresent(s -> {
            if (s.getUserEmail().equals(email)) repo.delete(s);
        });
        return ResponseEntity.ok().build();
    }

    private String extractEmail(String authHeader) {
        return jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
    }
}