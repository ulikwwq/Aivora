package com.aivora.backend.controller;

import com.aivora.backend.dto.RecommendationRequest;
import com.aivora.backend.service.RecommendationService;
import com.aivora.backend.service.UniversityDataset;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<List<UniversityDataset.University>> recommend(
            @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.recommend(
                request.getInterests(),
                request.getCountry(),
                request.getSpecialty()
        ));
    }

    @GetMapping
    public ResponseEntity<List<UniversityDataset.University>> getAll() {
        return ResponseEntity.ok(recommendationService.getAll());
    }

    @GetMapping("/countries")
    public ResponseEntity<List<String>> getCountries() {
        return ResponseEntity.ok(recommendationService.getCountries());
    }

    @GetMapping("/requirements/{university}")
    public ResponseEntity<?> getRequirements(@PathVariable String university) {
        return recommendationService.findByName(university)
                .map(u -> ResponseEntity.ok(Map.of(
                        "university", u.name(),
                        "country", u.country(),
                        "city", u.city(),
                        "specialties", u.specialties(),
                        "admissionInfo", u.admissionInfo(),
                        "website", u.website(),
                        "minScore", u.minScore()
                )))
                .orElse(ResponseEntity.notFound().build());
    }
}