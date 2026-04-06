package com.aivora.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UniversityDataset dataset;

    public List<UniversityDataset.University> recommend(String interests) {
        String query = interests.toLowerCase();

        return dataset.getAll().stream()
                .filter(u -> u.tags().stream()
                        .anyMatch(tag -> query.contains(tag) || tag.contains(query.split(" ")[0]))
                )
                .sorted(Comparator.comparingInt(UniversityDataset.University::minScore).reversed())
                .limit(3)
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
}