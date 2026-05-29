package com.aivora.backend.service;

import com.aivora.backend.exception.ResourceNotFoundException;
import com.aivora.backend.service.strategy.RecommendationStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UniversityDataset dataset;
    private final Map<String, RecommendationStrategy> strategies;

    public List<UniversityDataset.University> recommend(
            String interests, String country, String specialty) {

        List<UniversityDataset.University> result = dataset.getAll();

        // Strategy Pattern — применяем нужную стратегию
        if (interests != null && !interests.isEmpty()) {
            result = strategies.get("byInterest").recommend(result, interests);
        }
        if (country != null && !country.isEmpty()) {
            result = strategies.get("byCountry").recommend(result, country);
        }
        if (specialty != null && !specialty.isEmpty()) {
            result = result.stream()
                    .filter(u -> u.specialties().stream()
                            .anyMatch(s -> s.toLowerCase().contains(specialty.toLowerCase())))
                    .collect(Collectors.toList());
        }

        return result.stream()
                .sorted(Comparator.comparingInt(
                        UniversityDataset.University::minScore).reversed())
                .collect(Collectors.toList());
    }

    public Optional<UniversityDataset.University> findByName(String name) {
        return dataset.getAll().stream()
                .filter(u -> u.name().equalsIgnoreCase(name))
                .findFirst();
    }

    public List<UniversityDataset.University> getAll() {
        return dataset.getAll();
    }

    public List<String> getCountries() {
        return dataset.getAll().stream()
                .map(UniversityDataset.University::country)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}