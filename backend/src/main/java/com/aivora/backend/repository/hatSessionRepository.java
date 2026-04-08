package com.aivora.backend.repository;

import com.aivora.backend.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserEmailOrderByUpdatedAtDesc(String userEmail);
}