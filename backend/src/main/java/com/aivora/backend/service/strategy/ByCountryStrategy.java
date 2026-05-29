package com.aivora.backend.service.strategy;

import com.aivora.backend.service.UniversityDataset;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component("byCountry")
public class ByCountryStrategy implements RecommendationStrategy {

    @Override
    public List<UniversityDataset.University> recommend(
            List<UniversityDataset.University> universities, String query) {
        if (query == null || query.isEmpty()) return universities;
        return universities.stream()
                .filter(u -> u.country().equalsIgnoreCase(query))
                .collect(Collectors.toList());
    }
}