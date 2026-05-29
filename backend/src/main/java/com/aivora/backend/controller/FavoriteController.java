package com.aivora.backend.controller;

import com.aivora.backend.model.FavoriteUniversity;
import com.aivora.backend.repository.FavoriteUniversityRepository;
import com.aivora.backend.security.JwtUtil;
import com.aivora.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteUniversityRepository repo;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<FavoriteUniversity>> getFavorites(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(repo.findByUserEmail(email));
    }

    @PostMapping
    public ResponseEntity<FavoriteUniversity> addFavorite(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        String email = extractEmail(authHeader);
        String uniName = body.get("universityName");

        if (repo.existsByUserEmailAndUniversityName(email, uniName)) {
            return ResponseEntity.ok(
                    repo.findByUserEmailAndUniversityName(email, uniName).get());
        }

        FavoriteUniversity fav = FavoriteUniversity.builder()
                .userEmail(email)
                .universityName(uniName)
                .country(body.getOrDefault("country", ""))
                .city(body.getOrDefault("city", ""))
                .build();

        return ResponseEntity.ok(repo.save(fav));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        String email = extractEmail(authHeader);
        FavoriteUniversity fav = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Избранное не найдено"));
        if (fav.getUserEmail().equals(email)) {
            repo.delete(fav);
        }
        return ResponseEntity.ok().build();
    }

    private String extractEmail(String authHeader) {
        return jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
    }
}
