package com.aivora.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UniversityDataset dataset;

    public List<UniversityDataset.University> recommend(String interests, String country, String specialty) {
        String query = interests != null ? interests.toLowerCase() : "";

        return dataset.getAll().stream()
                .filter(u -> {
                    boolean matchesInterest = query.isEmpty() ||
                            u.tags().stream().anyMatch(tag ->
                                    query.contains(tag) || tag.contains(query.split(" ")[0])
                            );
                    boolean matchesCountry = country == null || country.isEmpty() ||
                            u.country().equalsIgnoreCase(country);
                    boolean matchesSpecialty = specialty == null || specialty.isEmpty() ||
                            u.specialties().stream().anyMatch(s ->
                                    s.toLowerCase().contains(specialty.toLowerCase())
                            );
                    return matchesInterest && matchesCountry && matchesSpecialty;
                })
                .sorted(Comparator.comparingInt(UniversityDataset.University::minScore).reversed())
                .limit(6)
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