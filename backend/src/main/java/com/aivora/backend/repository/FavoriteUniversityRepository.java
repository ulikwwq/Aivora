package com.aivora.backend.repository;

import com.aivora.backend.model.FavoriteUniversity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteUniversityRepository
        extends JpaRepository<FavoriteUniversity, Long> {
    List<FavoriteUniversity> findByUserEmail(String userEmail);
    Optional<FavoriteUniversity> findByUserEmailAndUniversityName(
            String userEmail, String universityName);
    boolean existsByUserEmailAndUniversityName(
            String userEmail, String universityName);
}